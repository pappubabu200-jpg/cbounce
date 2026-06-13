import asyncio
import csv
import io
import uuid
import logging
from typing import Dict, Any, List
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()

# In-memory store for bulk verification tasks
# In production, use Redis or a Database
TASKS: Dict[str, Dict[str, Any]] = {}

async def process_bulk_verification(task_id: str, emails: List[str]):
    try:
        from core.engine import check_email
        BATCH_SIZE = 100
        
        for i in range(0, len(emails), BATCH_SIZE):
            # Check if task was deleted
            if task_id not in TASKS:
                return
            
            batch = emails[i:i + BATCH_SIZE]
            
            # Process batch sequentially to avoid overwhelming SMTP/DNS,
            # but ideally this could be an asyncio.gather. Let's do gather.
            tasks = [check_email(email, check_smtp=True) for email in batch]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Double check task wasn't deleted while waiting
            if task_id not in TASKS:
                return
            
            task = TASKS[task_id]
            
            for email, result in zip(batch, results):
                if isinstance(result, Exception):
                    # Handle exception, mark unknown
                    res_dict = {
                        "email": email,
                        "status": "unknown",
                        "score": 0,
                        "deliverability": "Unknown",
                        "mx_valid": False,
                        "is_disposable": False,
                        "is_role_account": False
                    }
                else:
                    # Map the result
                    res_dict = {
                        "email": email,
                        "status": result.get("status", "unknown"),
                        "score": result.get("score", 0),
                        "deliverability": result.get("deliverability", "Unknown"),
                        "mx_valid": result.get("mx_valid", False),
                        "is_disposable": result.get("is_disposable", False),
                        "is_role_account": result.get("is_role_account", False)
                    }
                
                task["results"].append(res_dict)
                task["processed"] += 1
                
                # Update metrics
                status = res_dict["status"]
                if status == "valid":
                    task["valid"] += 1
                elif status in ("invalid", "disposable"):
                    task["invalid"] += 1
                elif status == "risky":
                    task["risky"] += 1
            
            task["progress"] = int((task["processed"] / task["total"]) * 100)
            TASKS[task_id] = task
        
        # Complete
        if task_id in TASKS:
            TASKS[task_id]["status"] = "complete"
            TASKS[task_id]["progress"] = 100

    except Exception as e:
        logging.error(f"Error in bulk verification task {task_id}: {str(e)}")
        if task_id in TASKS:
            TASKS[task_id]["status"] = "error"


@router.post("/upload")
async def upload_bulk(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith((".csv", ".xlsx")):
        raise HTTPException(status_code=400, detail="Only CSV and XLSX files are supported")
    
    contents = await file.read()
    emails = []
    
    try:
        if file.filename.endswith(".csv"):
            text = contents.decode("utf-8-sig")
            reader = csv.reader(io.StringIO(text))
            
            header = next(reader, None)
            if not header:
                raise HTTPException(status_code=400, detail="Empty CSV file")
            
            # Find email column (case insensitive)
            email_idx = 0
            for i, col in enumerate(header):
                if "email" in col.lower():
                    email_idx = i
                    break
            
            for row in reader:
                if len(row) > email_idx:
                    email = row[email_idx].strip()
                    if "@" in email and "." in email:
                        emails.append(email)
                        
        elif file.filename.endswith(".xlsx"):
            import openpyxl
            wb = openpyxl.load_workbook(io.BytesIO(contents), data_only=True)
            sheet = wb.active
            
            # Read first row for headers
            headers = [str(cell.value).strip().lower() if cell.value else "" for cell in sheet[1]]
            email_idx = 0
            for i, h in enumerate(headers):
                if "email" in h:
                    email_idx = i
                    break
            
            # Read rows
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if len(row) > email_idx and row[email_idx]:
                    email = str(row[email_idx]).strip()
                    if "@" in email and "." in email:
                        emails.append(email)
                        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}")
    
    if not emails:
        raise HTTPException(status_code=400, detail="No valid emails found in file")
    
    task_id = str(uuid.uuid4())
    
    # Cap at 100,000 for safety in memory
    emails = emails[:100000]
    
    TASKS[task_id] = {
        "status": "processing",
        "progress": 0,
        "total": len(emails),
        "processed": 0,
        "valid": 0,
        "invalid": 0,
        "risky": 0,
        "results": []
    }
    
    # Start background task
    background_tasks.add_task(process_bulk_verification, task_id, emails)
    
    return {"success": True, "task_id": task_id}


@router.get("/status/{task_id}")
async def get_task_status(task_id: str):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Create a shallow copy without returning all results if processing
    task = TASKS[task_id]
    
    response = {
        "status": task["status"],
        "progress": task["progress"],
        "total": task["total"],
        "processed": task["processed"],
        "valid": task["valid"],
        "invalid": task["invalid"],
        "risky": task["risky"],
        # Only return full results if complete to save bandwidth during polling
        "results": task["results"] if task["status"] in ("complete", "error") else []
    }
    
    return response


@router.get("/download/{task_id}")
async def download_results(task_id: str):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task = TASKS[task_id]
    if task["status"] != "complete":
        raise HTTPException(status_code=400, detail="Task not yet complete")
        
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["email", "status", "score", "deliverability", "mx_valid", "is_disposable", "is_role_account"])
    
    for r in task["results"]:
        writer.writerow([
            r["email"], 
            r["status"], 
            r["score"], 
            r["deliverability"], 
            r["mx_valid"], 
            r["is_disposable"], 
            r["is_role_account"]
        ])
        
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]), 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename=cleanbounce_results_{task_id}.csv"}
    )


@router.delete("/{task_id}")
async def delete_task(task_id: str):
    if task_id in TASKS:
        del TASKS[task_id]
    return {"success": True}
