from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.events import FailedPaymentEvent
from app.db import repository

router = APIRouter()

@router.post("/")
def ingest_batch(events: List[FailedPaymentEvent]):
    if not events:
        raise HTTPException(status_code=400, detail="Empty batch")
        
    batch_id = events[0].batch_id
    repository.store_batch(batch_id, events)
    return {"message": f"Ingested {len(events)} events for batch {batch_id}", "batch_id": batch_id}

from fastapi import UploadFile, File

@router.post("/simulate-external")
def simulate_external_sync():
    from app.utils.data_generator import generate_synthetic_batch
    events = generate_synthetic_batch(50)
    batch_id = events[0].batch_id
    repository.store_batch(batch_id, events)
    return {"message": f"Simulated external sync and ingested {len(events)} events", "batch_id": batch_id}

@router.post("/transform-csv")
async def transform_csv(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8")
    
    from app.utils.pipeline import DataTransformer
    events = DataTransformer.transform_csv(text)
    
    if not events:
        raise HTTPException(status_code=400, detail="Could not parse any events from CSV")
        
    batch_id = events[0].batch_id
    repository.store_batch(batch_id, events)
    return {"message": f"Transformed and ingested {len(events)} events", "batch_id": batch_id}

@router.post("/load-sample")
def load_sample():
    import json
    events_data = []
    try:
        with open("app/data/synthetic_batches/failed_payments_batch_01.jsonl", "r") as f:
            for line in f:
                events_data.append(FailedPaymentEvent.model_validate_json(line))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load sample data: {e}")
        
    if not events_data:
        raise HTTPException(status_code=400, detail="Sample data file is empty")
        
    batch_id = events_data[0].batch_id
    repository.store_batch(batch_id, events_data)
    return {"message": f"Loaded {len(events_data)} events from sample", "batch_id": batch_id}


