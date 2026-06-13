from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import history, leadshield, bulk

app = FastAPI(title="cbounce.io API", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(history.router, prefix="/v1/history", tags=["History"])
app.include_router(leadshield.router, prefix="/v1/leadshield", tags=["LeadShield"])
app.include_router(bulk.router, prefix="/v1/bulk", tags=["Bulk Verification"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "cbounce-api", "version": "2.1.0"}

@app.get("/")
async def root():
    return {
        "name": "CleanBounce API",
        "status": "healthy",
        "docs": "/docs"
    }
@app.post("/v1/verify/single/free")
async def verify_free(req: dict):
    from core.engine import check_email
    result = await check_email(req["email"], check_smtp=False)
    try:
        from routers.history import save_history, load_history
        h = load_history()
        import datetime
        h.append({**result, "verified_at": datetime.datetime.utcnow().isoformat()})
        save_history(h)
    except:
        pass
    return {"success": True, "data": result}

@app.post("/v1/verify/single")
async def verify_single(req: dict):
    from core.engine import check_email
    result = await check_email(req["email"], check_smtp=True)
    return {"success": True, "data": result}
