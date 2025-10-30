# Quick Test Commands for ApnaBazaar

## 🎯 Production Tests (Deployed Backend)

### Main Backend API Tests

**Web UI Mode:**
```bash
locust -f locustfile.py --host=https://apnabazaar-backend-3iwt.onrender.com
```
Then open: http://localhost:8089

**Quick Test (50 users, 2 minutes):**
```bash
locust -f locustfile.py --host=https://apnabazaar-backend-3iwt.onrender.com --users 50 --spawn-rate 5 --run-time 2m --headless
```

**Stress Test (200 users, 5 minutes):**
```bash
locust -f locustfile.py --host=https://apnabazaar-backend-3iwt.onrender.com --users 200 --spawn-rate 20 --run-time 5m --headless
```

**Generate HTML Report:**
```bash
locust -f locustfile.py --host=https://apnabazaar-backend-3iwt.onrender.com --users 100 --spawn-rate 10 --run-time 3m --headless --html production_performance_report.html
```

### ML Recommendation System Tests

**Test Recommendations:**
```bash
locust -f locustfile_ml.py --host=https://recommendation-system-1-51qz.onrender.com --users 20 --spawn-rate 2 --run-time 2m --headless
```

---

## 💻 Local Development Tests

### Test Local Backend

**Start your backend first:**
```bash
cd Backend
npm run dev
```

**Then run Locust:**
```bash
locust -f locustfile.py --host=http://localhost:3000
```

**Quick Local Test:**
```bash
locust -f locustfile.py --host=http://localhost:3000 --users 50 --spawn-rate 10 --run-time 1m --headless
```

---

## 📊 Comparison Test

Run the same test on both local and production to compare:

**Local:**
```bash
locust -f locustfile.py --host=http://localhost:3000 --users 50 --spawn-rate 5 --run-time 2m --headless --html local_test.html
```

**Production:**
```bash
locust -f locustfile.py --host=https://apnabazaar-backend-3iwt.onrender.com --users 50 --spawn-rate 5 --run-time 2m --headless --html production_test.html
```

Then compare the two HTML reports!

---

## 🔍 Monitoring During Tests

### Check Render.com Dashboard
- Go to https://render.com dashboard
- Monitor CPU, Memory, and Request metrics
- Watch for errors or warnings

### Check Browser Console
- Visit https://apnabzaar.netlify.app/
- Open DevTools (F12) → Network tab
- Monitor real API calls during load test

---

## ⚡ Quick Reference

| Test Type | Users | Duration | Command |
|-----------|-------|----------|---------|
| Smoke Test | 10 | 30s | `--users 10 --spawn-rate 2 --run-time 30s` |
| Light Load | 50 | 2m | `--users 50 --spawn-rate 5 --run-time 2m` |
| Medium Load | 100 | 5m | `--users 100 --spawn-rate 10 --run-time 5m` |
| Stress Test | 200 | 10m | `--users 200 --spawn-rate 20 --run-time 10m` |
| Spike Test | 500 | 2m | `--users 500 --spawn-rate 100 --run-time 2m` |

---

## 📝 Tips

1. **Always start small** - Test with 10 users first
2. **Check server health** - Monitor Render.com dashboard
3. **Save reports** - Use `--html` flag to generate reports
4. **Test regularly** - Run tests before major deployments
5. **Compare results** - Track performance over time

---

## 🆘 If Tests Fail

1. Check if backend is awake (Render free tier sleeps after inactivity)
2. Verify backend URL is correct
3. Check CORS settings
4. Review backend logs in Render dashboard
5. Reduce number of users and try again

