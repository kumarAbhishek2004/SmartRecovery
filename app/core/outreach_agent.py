import random
from typing import Dict, Any

class OutreachAgent:
    @staticmethod
    def generate_content(event: Dict[str, Any], decision_action: str, rationale: str) -> Dict[str, Any]:
        """
        Generates personalized messaging, a simulated recovery link, and incentive codes.
        """
        amount = event.get("amount", 0)
        customer_id = event.get("customer_id", "Customer")
        failure_code = event.get("failure_code", "unknown")
        
        formatted_amount = f"₹{amount}"
        recovery_link_id = f"paylink_rz_{random.randint(100000, 999999)}"
        recovery_url = f"http://localhost:5173/?paylink={recovery_link_id}"
        
        whatsapp_text = ""
        email_subject = ""
        email_body = ""
        incentive_code = None
        recommended_modes = []

        if decision_action == "no_op" and "cooldown" in rationale.lower():
            whatsapp_text = f"Hi {customer_id}, your recent payment of {formatted_amount} failed due to a bank network issue. We are holding retries to prevent multiple charges. You can pay securely here: {recovery_url}"
            email_subject = f"Action Required: Temporary bank outage for your payment"
            email_body = f"Dear {customer_id},\n\nWe noticed your payment of {formatted_amount} failed due to bank downtime.\nPay here using an alternative method: {recovery_url}"
            recommended_modes = ["UPI Intent (PhonePe/GPay)", "NetBanking"]
            
        elif failure_code == "insufficient_funds":
            incentive_code = "REV5OFF"
            whatsapp_text = f"Hi {customer_id}, your payment of {formatted_amount} was declined. Use code *{incentive_code}* for a 5% discount if paid today! Tap here: {recovery_url}"
            email_subject = f"Special Offer: 5% off your renewal payment"
            email_body = f"Dear {customer_id},\n\nYour payment of {formatted_amount} was declined.\nUse code {incentive_code} for a 5% waiver: {recovery_url}"
            recommended_modes = ["Razorpay Magic UPI", "Credit Card"]
            
        elif failure_code == "upi_mandate_expired":
            whatsapp_text = f"Hi {customer_id}, your UPI autopay mandate for {formatted_amount} has expired. Please re-authorize it here instantly: {recovery_url}"
            email_subject = f"Action Needed: Update your UPI Mandate"
            email_body = f"Dear {customer_id},\n\nYour UPI mandate for {formatted_amount} expired.\nPlease re-authorize using this link: {recovery_url}"
            recommended_modes = ["UPI Autopay"]
            
        else:
            whatsapp_text = f"Hi {customer_id}, your payment of {formatted_amount} requires an update. Resolve it securely here: {recovery_url}"
            email_subject = f"Quick Update: Resolve your payment"
            email_body = f"Dear {customer_id},\n\nPlease update your payment method for your recent invoice of {formatted_amount}: {recovery_url}"
            recommended_modes = ["Credit/Debit Card", "UPI"]

        return {
            "whatsapp_text": whatsapp_text,
            "email_subject": email_subject,
            "email_body": email_body,
            "recovery_url": recovery_url,
            "incentive_code": incentive_code,
            "recommended_modes": recommended_modes
        }
