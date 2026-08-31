from fastapi import APIRouter
from app.api.routes import ingest, recovery, metrics, audit, webhooks, legacy_ui

api_router = APIRouter()

api_router.include_router(ingest.router, prefix="/ingest", tags=["Ingestion"])
api_router.include_router(recovery.router, prefix="/recovery", tags=["Recovery"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["Metrics"])
api_router.include_router(audit.router, prefix="/audit", tags=["Audit"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
api_router.include_router(legacy_ui.router, tags=["LegacyUI"])
