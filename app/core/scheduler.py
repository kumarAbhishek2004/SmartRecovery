import asyncio
import json
from datetime import datetime
import os
from pathlib import Path

DB_PATH = Path(os.getcwd()) / "db.json"

async def background_scheduler_loop():
    """
    A lightweight background loop that checks for campaigns needing follow-up.
    Runs every 10 seconds to simulate time-based autonomous actions.
    """
    print("⏳ Starting Autonomous Campaign Scheduler...")
    while True:
        try:
            if DB_PATH.exists():
                with open(DB_PATH, "r") as f:
                    state = json.load(f)
                
                updates_made = False
                current_time = datetime.utcnow()
                
                for campaign in state.get("campaigns", []):
                    # For demo purposes, we trigger the "Day 3 Reminder" if a campaign 
                    # has been IN_RECOVERY and hasn't had a reminder yet.
                    if campaign["status"] == "IN_RECOVERY":
                        timeline = campaign.get("timeline", [])
                        
                        # Check if "Day 3 Reminder Sent" is already in timeline
                        has_reminder = any("Reminder Sent" in event["event"] for event in timeline)
                        
                        if not has_reminder:
                            # In a real app, we'd check if (current_time - created_at).days >= 3
                            # For the demo, we check if the flag 'simulate_time' was triggered, 
                            # or just add it automatically after a short delay.
                            pass
                            
                # If we mutated the state, save it back
                if updates_made:
                    with open(DB_PATH, "w") as f:
                        json.dump(state, f, indent=4)
                        
        except Exception as e:
            print(f"Scheduler Error: {e}")
            
        # Wait 10 seconds before polling again
        await asyncio.sleep(10)
