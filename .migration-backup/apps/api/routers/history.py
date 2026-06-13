from fastapi import APIRouter, Query
from typing import Optional
import json, os

router = APIRouter()

# Simple file-based history (no DB dependency for now)
HISTORY_FILE = "/tmp/verification_history.json"

def load_history():
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_history(data):
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump(data[-1000:], f)  # Keep last 1000
    except:
        pass

@router.post("/add")
async def add_history(req: dict):
    history = load_history()
    history.append(req)
    save_history(history)
    return {"success": True}

@router.get("/")
async def get_history(
    page: int = 1,
    limit: int = 20,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    history = load_history()
    history = list(reversed(history))  # Latest first

    # Filter
    if status and status != "all":
        history = [h for h in history if h.get("status") == status]
    if search:
        history = [h for h in history if search.lower() in h.get("email", "").lower()]

    total = len(history)
    start = (page - 1) * limit
    end = start + limit

    return {
        "success": True,
        "data": history[start:end],
        "meta": {
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit,
        }
    }

@router.delete("/clear")
async def clear_history():
    save_history([])
    return {"success": True, "message": "History cleared"}
