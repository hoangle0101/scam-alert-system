"""Quick integration test for all major API endpoints."""
import httpx
import json

base = "http://localhost:8000/api/v1"

# 1. Login as demo user
print("=== LOGIN ===")
r = httpx.post(f"{base}/auth/login", json={"email": "user@scamguardian.vn", "password": "user123"})
tokens = r.json()
print("Login:", r.status_code, tokens.get("token_type", "FAILED"))
token = tokens.get("access_token", "")
headers = {"Authorization": f"Bearer {token}"}

# 2. Get profile
print("\n=== PROFILE ===")
r = httpx.get(f"{base}/auth/me", headers=headers)
print("Profile:", r.status_code, r.json().get("full_name", ""))

# 3. Scan URL (Phishing)
print("\n=== SCAN URL (Phishing) ===")
r = httpx.post(f"{base}/scan/url", json={"url": "https://vietcombank-verify.online/login"}, headers=headers)
result = r.json()
print(f"Verdict: {result.get('verdict')} | Risk: {result.get('risk_level')} | Confidence: {result.get('confidence')}")
print(f"Model: {result.get('model_version')} | Time: {result.get('processing_time_ms')}ms")
if result.get("analysis_details"):
    for s in result["analysis_details"].get("signals", []):
        print(f"  -> {s['name']}: {s['score']} ({s['detail']})")

# 4. Scan URL (Safe)
print("\n=== SCAN URL (Safe) ===")
r = httpx.post(f"{base}/scan/url", json={"url": "https://google.com"}, headers=headers)
result = r.json()
print(f"Verdict: {result.get('verdict')} | Risk: {result.get('risk_level')} | Confidence: {result.get('confidence')}")

# 5. Scan Message
print("\n=== SCAN MESSAGE ===")
r = httpx.post(f"{base}/scan/message", json={"content": "Ban da trung thuong iPhone 15. Click vao link de nhan thuong ngay!"}, headers=headers)
result = r.json()
print(f"Verdict: {result.get('verdict')} | Risk: {result.get('risk_level')}")

# 6. Knowledge articles
print("\n=== KNOWLEDGE ===")
r = httpx.get(f"{base}/knowledge/articles")
k = r.json()
print(f"Total articles: {k.get('total')}")
for a in k.get("articles", []):
    print(f"  - {a['title']} [{a['category']}]")

# 7. Scan history
print("\n=== SCAN HISTORY ===")
r = httpx.get(f"{base}/scan/history", headers=headers)
h = r.json()
print(f"Total scans: {h.get('total')}")

# 8. Admin login + dashboard
print("\n=== ADMIN LOGIN ===")
r = httpx.post(f"{base}/auth/login", json={"email": "admin@scamguardian.vn", "password": "admin123"})
admin_tokens = r.json()
admin_headers = {"Authorization": f"Bearer {admin_tokens.get('access_token', '')}"}

print("\n=== ADMIN DASHBOARD ===")
r = httpx.get(f"{base}/admin/dashboard", headers=admin_headers)
dash = r.json()
print(f"Users: {dash.get('total_users')} | Scans: {dash.get('total_scans')} | Threats: {dash.get('threats_detected')} | Articles: {dash.get('knowledge_articles')}")

print("\n=== ALL TESTS PASSED ===")
