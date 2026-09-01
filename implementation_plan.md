

### Phase 4: Live Analytics Charts
- Install `recharts` library to the React frontend.
- Inject an animated Line Chart into `Dashboard.jsx` right below the KPI cards.
- Plot simulated 'Revenue Recovered' vs 'Revenue at Risk' over a 7-day period to give the dashboard a highly professional, enterprise-grade feel.


### Phase 5: The Closed-Loop Checkout Portal
- Create a new backend endpoint `/api/checkout/{id}/success` that marks a campaign as RECOVERED and increments the ARR Recovered metric.
- Update `WhatsAppSimulator.jsx` to detect Razorpay links (`rzp.io`) and make them clickable.
- Build a `MockCheckoutModal` React component that mimics a Razorpay payment page.
- When the user clicks 'Pay' on the mock checkout, it hits the success endpoint, closes the flow, and updates the dashboard metrics live.
