from bson import ObjectId
import numpy as np
import pandas as pd
import datetime
from decimal import Decimal


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

