"""
Locust Load Testing for ApnaBazaar ML Recommendation System

Tests the machine learning recommendation service deployed on Render.com
"""

from locust import HttpUser, task, between
import random


class RecommendationUser(HttpUser):
    """
    Simulates users getting product recommendations
    """
    wait_time = between(2, 5)
    
    @task(1)
    def get_recommendations(self):
        """Test the recommendation endpoint"""
        # Add your actual ML API endpoints here
        # Example structure - adjust based on your actual API
        
        # If you have a user-based recommendation endpoint:
        user_ids = [f"user_{i}" for i in range(1, 100)]
        user_id = random.choice(user_ids)
        
        self.client.get(
            f"/recommend?user_id={user_id}",
            name="Get User Recommendations"
        )
    
    @task(2)
    def get_similar_products(self):
        """Test similar product recommendations"""
        # Adjust based on your actual endpoint
        product_ids = [f"prod_{i}" for i in range(1, 500)]
        product_id = random.choice(product_ids)
        
        self.client.get(
            f"/similar?product_id={product_id}",
            name="Get Similar Products"
        )


# To run this test:
# locust -f locustfile_ml.py --host=https://recommendation-system-1-51qz.onrender.com

