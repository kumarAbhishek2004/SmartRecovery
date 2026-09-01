
import re
with open('frontend/src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'tickFormatter=\{\(value\) => \[^\]*\$\{value\}\\}', r'tickFormatter={(value) => \u20B9}', c)
c = re.sub(r'name=\x22Recovered[^\x22]*\x22', 'name=\x22Recovered (\u20B9)\x22', c)
c = re.sub(r'name=\x22At Risk[^\x22]*\x22', 'name=\x22At Risk (\u20B9)\x22', c)

with open('frontend/src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

