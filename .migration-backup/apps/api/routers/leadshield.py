from fastapi import APIRouter, Header, HTTPException
from typing import Optional
import json, os, time
from datetime import datetime

router = APIRouter()

STATS_FILE = "/tmp/leadshield_stats.json"
CONFIG_FILE = "/tmp/leadshield_config.json"

def load_stats():
    try:
        with open(STATS_FILE, "r") as f:
            return json.load(f)
    except:
        return {"blocked": 0, "passed": 0, "total": 0, "disposable": 0, "role": 0, "low_score": 0, "logs": []}

def save_stats(data):
    try:
        data["logs"] = data.get("logs", [])[-500:]  # Keep last 500
        with open(STATS_FILE, "w") as f:
            json.dump(data, f)
    except:
        pass

def load_config():
    try:
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    except:
        return {
            "risk_threshold": 70,
            "block_disposable": True,
            "block_role_accounts": False,
            "widget_key": "ls_cbounce_default",
            "allowed_domains": [],
            "custom_blocklist": []
        }

def save_config(data):
    try:
        with open(CONFIG_FILE, "w") as f:
            json.dump(data, f)
    except:
        pass

@router.post("/check")
async def leadshield_check(req: dict):
    """Real-time lead protection check"""
    email = req.get("email", "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email required")

    config = load_config()
    stats = load_stats()

    # Verify email
    from core.engine import check_email
    result = await check_email(email, check_smtp=False)

    # Block logic
    threshold = config.get("risk_threshold", 70)
    block_disposable = config.get("block_disposable", True)
    block_role = config.get("block_role_accounts", False)
    custom_blocklist = config.get("custom_blocklist", [])

    blocked_by = []
    if result.get("score", 0) < (100 - threshold):
        blocked_by.append("low_score")
    if block_disposable and result.get("is_disposable"):
        blocked_by.append("disposable")
    if block_role and result.get("is_role_account"):
        blocked_by.append("role_account")
    if email in custom_blocklist or email.split("@")[-1] in custom_blocklist:
        blocked_by.append("blocklist")

    blocked = len(blocked_by) > 0

    # Update stats
    stats["total"] = stats.get("total", 0) + 1
    if blocked:
        stats["blocked"] = stats.get("blocked", 0) + 1
        if "disposable" in blocked_by:
            stats["disposable"] = stats.get("disposable", 0) + 1
        if "role_account" in blocked_by:
            stats["role"] = stats.get("role", 0) + 1
        if "low_score" in blocked_by:
            stats["low_score"] = stats.get("low_score", 0) + 1
    else:
        stats["passed"] = stats.get("passed", 0) + 1

    # Log entry
    log = {
        "email": email,
        "blocked": blocked,
        "blocked_by": blocked_by,
        "score": result.get("score", 0),
        "status": result.get("status", "unknown"),
        "timestamp": datetime.utcnow().isoformat(),
    }
    stats["logs"] = stats.get("logs", [])
    stats["logs"].append(log)
    save_stats(stats)

    return {
        "success": True,
        "blocked": blocked,
        "blocked_by": blocked_by,
        "email": email,
        "score": result.get("score", 0),
        "status": result.get("status", "unknown"),
        "is_disposable": result.get("is_disposable", False),
        "is_role_account": result.get("is_role_account", False),
        "mx_valid": result.get("mx_valid", False),
        "recommendation": "block" if blocked else "allow"
    }

@router.get("/stats")
async def get_stats():
    stats = load_stats()
    total = stats.get("total", 0)
    blocked = stats.get("blocked", 0)
    return {
        "success": True,
        "data": {
            "total": total,
            "blocked": blocked,
            "passed": stats.get("passed", 0),
            "block_rate": round((blocked / total * 100), 1) if total > 0 else 0,
            "disposable_blocked": stats.get("disposable", 0),
            "role_blocked": stats.get("role", 0),
            "low_score_blocked": stats.get("low_score", 0),
            "recent_logs": list(reversed(stats.get("logs", [])))[:20],
        }
    }

@router.get("/config")
async def get_config():
    return {"success": True, "data": load_config()}

@router.put("/config")
async def update_config(req: dict):
    config = load_config()
    config.update({
        "risk_threshold": req.get("risk_threshold", config["risk_threshold"]),
        "block_disposable": req.get("block_disposable", config["block_disposable"]),
        "block_role_accounts": req.get("block_role_accounts", config["block_role_accounts"]),
        "custom_blocklist": req.get("custom_blocklist", config["custom_blocklist"]),
    })
    save_config(config)
    return {"success": True, "data": config}

@router.get("/logs")
async def get_logs(limit: int = 50):
    stats = load_stats()
    logs = list(reversed(stats.get("logs", [])))[:limit]
    return {"success": True, "data": logs}

@router.delete("/stats/reset")
async def reset_stats():
    save_stats({"blocked": 0, "passed": 0, "total": 0, "disposable": 0, "role": 0, "low_score": 0, "logs": []})
    return {"success": True, "message": "Stats reset"}
