# Locust Load Testing Guide for ApnaBazaar E-Commerce

This guide will help you run load tests on your E-Commerce application using Locust.

## What is Locust?

Locust is an open-source load testing tool that allows you to:
- Simulate thousands of concurrent users
- Test your API performance under load
- Identify bottlenecks and performance issues
- Generate detailed performance reports

## Prerequisites

1. **Backend Server Running**: Make sure your backend server is running on `http://localhost:3000`
2. **Python Installed**: You need Python 3.7 or higher
3. **Database Connected**: Ensure your MongoDB database is accessible

## Installation

### Step 1: Install Locust

Open PowerShell/Terminal and run:

```bash
pip install -r locust_requirements.txt
```

Or install directly:

```bash
pip install locust
```

### Step 2: Verify Installation

```bash
locust --version
```

You should see the Locust version number.

## Running Locust Tests

### Method 1: Web UI Mode (Recommended for Beginners)

1. **Start your Backend Server**:
   ```bash
   cd Backend
   npm run dev
   ```

2. **Open a new terminal and run Locust**:
   ```bash
   locust -f locustfile.py --host=http://localhost:3000
   ```

3. **Open Web Interface**:
   - Open your browser and go to: `http://localhost:8089`
   - You'll see the Locust web interface

4. **Configure Test Parameters**:
   - **Number of users**: Total users to simulate (e.g., 100)
   - **Spawn rate**: Users to add per second (e.g., 10)
   - Click "Start Swarming"

5. **Monitor Results**:
   - View real-time statistics
   - See response times, failure rates, and requests per second
   - Watch charts for performance trends

### Method 2: Headless Mode (For CI/CD)

Run tests without the web interface:

```bash
locust -f locustfile.py --host=http://localhost:3000 --users 100 --spawn-rate 10 --run-time 1m --headless
```

Parameters:
- `--users 100`: Simulate 100 concurrent users
- `--spawn-rate 10`: Add 10 users per second
- `--run-time 1m`: Run test for 1 minute (use 30s, 5m, 1h, etc.)
- `--headless`: Run without web UI

### Method 3: Generate HTML Report

```bash
locust -f locustfile.py --host=http://localhost:3000 --users 50 --spawn-rate 5 --run-time 2m --headless --html locust_report.html
```

This will create a detailed HTML report: `locust_report.html`

## Understanding the Test Scenarios

The `locustfile.py` includes three types of simulated users:

### 1. ProductBrowsingUser (60% of traffic)
Simulates realistic shopping journey:
- Browse all products
- View categories
- Search for products
- View product details
- Check authentication status

### 2. QuickSearchUser (20% of traffic)
Users with specific intent:
- Quick product searches
- Rapid category browsing
- Fast navigation

### 3. CategoryBrowser (20% of traffic)
Category-focused shoppers:
- Browse products by category
- Explore different categories

## Customizing Tests

### Change User Distribution

Edit weights in `locustfile.py`:

```python
class ProductBrowsingUser(HttpUser):
    weight = 5  # 50% of users

class QuickSearchUser(HttpUser):
    weight = 3  # 30% of users

class CategoryBrowser(HttpUser):
    weight = 2  # 20% of users
```

### Adjust Wait Times

Modify thinking time between actions:

```python
wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
```

### Add More Endpoints

Add new tasks to test additional features:

```python
@task(1)
def add_to_cart(self):
    self.client.post(
        "/api/order/addtocart",
        json={"productId": self.product_id, "quantity": 1}
    )
```

## Interpreting Results

### Key Metrics to Watch:

1. **Response Time (ms)**:
   - 50th percentile: Typical user experience
   - 95th percentile: Worst case for most users
   - 99th percentile: Extreme cases

2. **Requests per Second (RPS)**:
   - How many requests your server handles
   - Higher is better

3. **Failure Rate**:
   - Should be close to 0%
   - Investigate any failures immediately

4. **Number of Users**:
   - Maximum concurrent users before degradation

### Performance Benchmarks:

- **Good**: Response time < 200ms, 0% failures
- **Acceptable**: Response time < 500ms, < 1% failures
- **Poor**: Response time > 1000ms, > 5% failures

## Common Testing Scenarios

### Light Load Test
```bash
locust -f locustfile.py --host=http://localhost:3000 --users 10 --spawn-rate 2 --run-time 1m --headless
```

### Medium Load Test
```bash
locust -f locustfile.py --host=http://localhost:3000 --users 100 --spawn-rate 10 --run-time 5m --headless
```

### Stress Test
```bash
locust -f locustfile.py --host=http://localhost:3000 --users 500 --spawn-rate 50 --run-time 10m --headless
```

### Spike Test (Sudden Traffic Surge)
```bash
locust -f locustfile.py --host=http://localhost:3000 --users 1000 --spawn-rate 100 --run-time 2m --headless
```

## Testing Production/Deployed Backend

If your backend is deployed (e.g., on Heroku, AWS, etc.):

```bash
locust -f locustfile.py --host=https://your-backend-url.com --users 50 --spawn-rate 5
```

## Troubleshooting

### Problem: Connection Errors

**Solution**: Ensure backend is running and accessible:
```bash
curl http://localhost:3000/api/product/getall
```

### Problem: High Failure Rate

**Possible Causes**:
- Backend not handling concurrent requests
- Database connection issues
- Rate limiting enabled
- Server resources exhausted

**Solution**: Check backend logs and database connections

### Problem: "Import Error" when running Locust

**Solution**: Ensure Locust is installed in correct Python environment:
```bash
pip install --upgrade locust
```

## Best Practices

1. **Start Small**: Begin with 10-20 users, then gradually increase
2. **Monitor Server**: Watch CPU, memory, and database during tests
3. **Test Incrementally**: Test individual endpoints before full scenarios
4. **Realistic Data**: Use actual product IDs and categories when possible
5. **Regular Testing**: Run load tests before each major deployment

## Advanced: Testing with Authentication

To test authenticated endpoints, you can add login functionality:

```python
def on_start(self):
    # Login and store token
    response = self.client.post("/api/user/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    # Store auth token/cookie for subsequent requests
```

## CI/CD Integration

Add to your CI/CD pipeline (GitHub Actions example):

```yaml
- name: Run Load Tests
  run: |
    pip install locust
    locust -f locustfile.py --host=${{ secrets.BACKEND_URL }} --users 50 --spawn-rate 5 --run-time 1m --headless
```

## Resources

- [Locust Documentation](https://docs.locust.io/)
- [Writing Your First Locust Test](https://docs.locust.io/en/stable/writing-a-locustfile.html)
- [Distributed Load Testing](https://docs.locust.io/en/stable/running-distributed.html)

## Support

For issues or questions about load testing:
1. Check backend logs
2. Verify database connectivity
3. Review Locust documentation
4. Check server resource usage (CPU, RAM, Network)

---

**Happy Load Testing! 🚀**

