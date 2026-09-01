from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import legacy_ui, chat, webhooks

app = FastAPI(title="SmartRecovery Core Engine")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])
app.include_router(legacy_ui.router, prefix="/api", tags=["Legacy UI"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

@app.get("/")
def read_root():
    return {"message": "AI Revenue Recovery Agent API is running."}
