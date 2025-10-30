"""
Locust Load Testing Configuration for ApnaBazaar E-Commerce Application

This file defines load testing scenarios for the backend API endpoints.
It simulates realistic user behavior patterns on the e-commerce platform.
"""

from locust import HttpUser, task, between, SequentialTaskSet
import random
import json


class UserBehavior(SequentialTaskSet):
    """
    Sequential task set simulating realistic user journey through the e-commerce site
    """
    
    def on_start(self):
        """Initialize test data for the user session"""
        self.product_id = None
        self.category = None
        self.auth_token = None
    
    @task(1)
    def browse_homepage(self):
        """Simulate user landing on homepage and viewing all products"""
        with self.client.get(
            "/api/product/getall",
            catch_response=True,
            name="Browse All Products"
        ) as response:
            if response.status_code == 200:
                response.success()
                try:
                    data = response.json()
                    # Store a random product ID for later use
                    if data and len(data) > 0:
                        self.product_id = data[random.randint(0, len(data)-1)].get('_id')
                except:
                    pass
            else:
                response.failure(f"Failed with status code: {response.status_code}")
    
    @task(2)
    def view_categories(self):
        """Simulate user viewing available categories"""
        with self.client.get(
            "/api/product/getcategories",
            catch_response=True,
            name="View Categories"
        ) as response:
            if response.status_code == 200:
                response.success()
                try:
                    data = response.json()
                    if data and len(data) > 0:
                        self.category = random.choice(data)
                except:
                    pass
            else:
                response.failure(f"Failed with status code: {response.status_code}")
    
    @task(2)
    def browse_by_category(self):
        """Simulate user browsing products in a specific category"""
        if self.category:
            with self.client.get(
                f"/api/product/get?cat={self.category}",
                catch_response=True,
                name="Browse Category Products"
            ) as response:
                if response.status_code == 200:
                    response.success()
                else:
                    response.failure(f"Failed with status code: {response.status_code}")
    
    @task(3)
    def search_products(self):
        """Simulate user searching for products"""
        search_terms = ["phone", "laptop", "shirt", "shoes", "watch", "bag", "camera"]
        search_term = random.choice(search_terms)
        
        with self.client.get(
            f"/api/product/search?name={search_term}",
            catch_response=True,
            name="Search Products"
        ) as response:
            if response.status_code == 200:
                response.success()
                try:
                    data = response.json()
                    if data and len(data) > 0:
                        self.product_id = data[0].get('_id')
                except:
                    pass
            else:
                response.failure(f"Failed with status code: {response.status_code}")
    
    @task(4)
    def view_product_details(self):
        """Simulate user viewing detailed product information"""
        if self.product_id:
            with self.client.get(
                f"/api/product/getbyid?id={self.product_id}",
                catch_response=True,
                name="View Product Details"
            ) as response:
                if response.status_code == 200:
                    response.success()
                else:
                    response.failure(f"Failed with status code: {response.status_code}")
    
    @task(1)
    def check_auth_status(self):
        """Simulate checking if user is authenticated"""
        with self.client.get(
            "/api/user/authcheck",
            catch_response=True,
            name="Check Auth Status"
        ) as response:
            # Auth check might return 401 for non-authenticated users, which is expected
            if response.status_code in [200, 401]:
                response.success()
            else:
                response.failure(f"Unexpected status code: {response.status_code}")


class ProductBrowsingUser(HttpUser):
    """
    Simulates users who primarily browse and search for products
    Most common user type on e-commerce sites
    """
    tasks = [UserBehavior]
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    weight = 3  # 60% of users will be browsers


class QuickSearchUser(HttpUser):
    """
    Simulates users who come with specific intent and search immediately
    """
    wait_time = between(0.5, 2)
    weight = 1  # 20% of users
    
    @task(5)
    def quick_search(self):
        """Search for specific products"""
        search_terms = ["phone", "laptop", "shirt", "shoes", "watch", "bag", "camera", "headphones"]
        search_term = random.choice(search_terms)
        
        self.client.get(
            f"/api/product/search?name={search_term}",
            name="Quick Search"
        )
    
    @task(3)
    def view_categories(self):
        """View available categories"""
        self.client.get(
            "/api/product/getcategories",
            name="View Categories"
        )
    
    @task(2)
    def browse_all(self):
        """Browse all products"""
        self.client.get(
            "/api/product/getall",
            name="Browse All Products"
        )


class CategoryBrowser(HttpUser):
    """
    Simulates users who browse products by category
    """
    wait_time = between(1, 4)
    weight = 1  # 20% of users
    
    def on_start(self):
        """Get categories on start"""
        response = self.client.get("/api/product/getcategories")
        try:
            self.categories = response.json()
        except:
            self.categories = ["Electronics", "Fashion", "Home", "Books"]
    
    @task(1)
    def browse_category(self):
        """Browse products in random category"""
        if hasattr(self, 'categories') and self.categories:
            category = random.choice(self.categories)
            self.client.get(
                f"/api/product/get?cat={category}",
                name="Browse Category"
            )


# Custom events for monitoring
from locust import events

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Executes when load test starts"""
    print("\n" + "="*60)
    print("🚀 Starting Load Test for ApnaBazaar E-Commerce Platform")
    print("="*60 + "\n")
    print("Testing Backend API at:", environment.host)
    print("User Types:")
    print("  - 60% Product Browsing Users (sequential journey)")
    print("  - 20% Quick Search Users (targeted searches)")
    print("  - 20% Category Browsers (category-focused)")
    print("\n" + "="*60 + "\n")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Executes when load test stops"""
    print("\n" + "="*60)
    print("✅ Load Test Completed for ApnaBazaar")
    print("="*60 + "\n")

