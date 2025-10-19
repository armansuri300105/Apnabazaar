import os
import pymysql
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
from scipy.sparse import coo_matrix
from implicit.als import AlternatingLeastSquares
from sklearn.preprocessing import LabelEncoder
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import pymongo

def making_data():
        
    mongo_url = "mongodb+srv://arshadmansuri1825:u1AYlNbjuA5FpHbb@cluster1.2majmfd.mongodb.net/ECommerce"  # e.g. mongodb+srv://username:password@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority

    client = MongoClient(mongo_url)

    db = client["ECommerce"]

    product_collection = db["products"]
    user_data_collection = db["users"]

    products = list(product_collection.find())
    users  = list(user_data_collection.find())

    product_data = []
    for p in products:
        if(p.get("isActive")):
            product_data.append({
                "productID": str(p["_id"]),
                "name": p["name"],
                "price": p["price"],
                "category": p["category"],
                "description": p.get("description", ""),
                "images": p.get("images", "Not Found"),
                "stock" : p.get("stock", "0"),
                "rating" : p.get("rating", "0"),
                "reviews" : p.get("reviews", "0"),
                "createdAt": p.get("createdAt", ""),
                "updatedAt": p.get("updatedAt", ""),
                "isActive": p.get("isActive", True)
            })

    user_data = []
    for u in users:
        for history in u.get("history", []):
            user_data.append({
                "user_id": str(u["_id"]),
                "productID": str(history.get("productId", "")),
                "event": history.get("event", {}).get("type","Not Found"),
                "Timestamp": history.get("time", ""),
                "duration":history.get("duration", 0)/1000 # Convert milli-second to second betwa
            })

    df_products = pd.DataFrame(product_data)
    print(df_products.head())

    df_user = pd.DataFrame(user_data)
    print(df_user.head())

    return df_products, df_user

