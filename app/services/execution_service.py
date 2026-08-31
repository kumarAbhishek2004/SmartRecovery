from app.schemas.decisions import RecoveryDecision, ActionExecutionResult
import random

class ExecutionService:
    """
    Mock execution layer that pretends to run the action 
    and records the result without making real API calls.
    """
    
    @staticmethod
    def execute(decision: RecoveryDecision) -> ActionExecutionResult:
        action = decision.action_taken
        
        # Simulate network or execution logic
        if action == "retry":
            # Just pretending we successfully scheduled it
            return ActionExecutionResult(
                success=True,
                message=f"Mock: Scheduled retry at {decision.retry_scheduled_at}"
            )
            
        elif action == "remind":
            return ActionExecutionResult(
                success=True,
                message="Mock: Notification sent successfully"
            )
            
        elif action == "escalate":
            return ActionExecutionResult(
                success=True,
                message="Mock: Ticket created for human review"
            )
            
        elif action == "no_op":
            return ActionExecutionResult(
                success=True,
                message="Mock: Ignored due to cooldown"
            )
            
        elif action == "stop":
            return ActionExecutionResult(
                success=True,
                message="Mock: Stopped recovery flow"
            )
            
        return ActionExecutionResult(
            success=False,
            message="Mock: Unknown action type"
        )
