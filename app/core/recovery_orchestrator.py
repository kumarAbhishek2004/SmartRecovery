from typing import List
from app.schemas.events import FailedPaymentEvent
from app.schemas.decisions import AuditLogRecord
from app.core.policy_engine import PolicyEngine
from app.core.classifier import FailureClassifier
from app.services.execution_service import ExecutionService
from app.core.outreach_agent import OutreachAgent

class RecoveryOrchestrator:
    """
    Coordinates the classification, decision making, execution, and audit logging.
    """
    
    @staticmethod
    def process_batch(events: List[FailedPaymentEvent]) -> List[AuditLogRecord]:
        audit_logs = []
        
        for event in events:
            # 1. Classification (for logging purposes)
            classification = FailureClassifier.classify(event)
            
            # 2. Policy Engine Decision
            decision = PolicyEngine.decide(event)
            
            # 3. Execution (Mocked)
            execution_result = ExecutionService.execute(decision)
            
            # 4. Generate Outreach Content
            outreach = OutreachAgent.generate_content(
                event.model_dump(), 
                decision.action_taken, 
                decision.rationale
            )
            
            # 5. Audit Logging
            audit_log = AuditLogRecord(
                subscription_id=event.subscription_id,
                batch_id=event.batch_id,
                input_event=event.model_dump(mode='json'),
                classification=classification,
                decision=decision.model_dump(mode='json'),
                action_taken=decision.action_taken,
                action_result=execution_result.model_dump(mode='json'),
                outreach_content=outreach,
                final_state="completed" if execution_result.success else "failed"
            )
            audit_logs.append(audit_log)
            
        return audit_logs
