from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="cbounce.io API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "cbounce-api"}

@app.post("/v1/verify/single/free")
async def verify_free(req: dict):
    from core.verification import check_email
    result = await check_email(req["email"])
    return {"success": True, "data": result}
