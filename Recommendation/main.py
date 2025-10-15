from bson import ObjectId
from fastapi.responses import JSONResponse
from h11 import Request
import numpy as np
import pandas as pd
import datetime
from decimal import Decimal
from fastapi.middleware.cors import CORSMiddleware

from recommendation import (
    hybrid_recommendation_system,
    rating_based_recommendation_system,
    content_based_recommendations,
    get_closest_match,
    als_recommendation,
    get_als_recommendations,
    making_data,
    content_based_recommendations_improved
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5173',
        'http://localhost:5174',
        'https://apnabzaar.netlify.app'
    ], 

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendRequest(BaseModel):
    item_name: str
    user_id: str | None = None


# templates me html code
templates = Jinja2Templates(directory="templates")


@app.get("/", tags=["default"])
async def index():
    return RedirectResponse(url="/docs")

def making_data_endpoint():
    df_product,df_user = making_data()
    return df_product, df_user



def make_serializable(obj):
    """Recursively convert obj into JSON-serializable Python primitives."""
    if isinstance(obj, pd.DataFrame):
        return make_serializable(obj.to_dict(orient="records"))
    if isinstance(obj, pd.Series):
        return make_serializable(obj.tolist())

    if isinstance(obj, ObjectId):
        return str(obj)


    if isinstance(obj, (datetime.datetime, datetime.date, datetime.time, pd.Timestamp)):
        try:
            return obj.isoformat()
        except Exception:
            return str(obj)

    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return make_serializable(obj.tolist())


    if isinstance(obj, Decimal):
        return float(obj)


    if isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [make_serializable(v) for v in obj]

    return obj

@app.post("/main", response_class=JSONResponse)
async def main_page(request: Request):
    df = making_data_endpoint()
    top_products = rating_based_recommendation_system(df)

    if hasattr(top_products, "to_dict"):
        recs = top_products.to_dict(orient="records")
    else:
        recs = top_products  

    recs = list(recs)
    
    return JSONResponse(content={"Top_rated_products": recs})