from sqlalchemy.orm import Session
import aiohttp
import models, schemas
from datetime import datetime, timedelta, timezone
import datetime as DT
import operator

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(email=user.email, password=user.password )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def get_ozon_metrics(user, delay): 
    metrics = {"date": [], "metrics": []}
    headers_oz = {"Client-Id": "1508094", "Api-Key": user.ozon_token, "Accept": "application/json"}
    begin = DT.date.today()
    end = DT.date.today()
    if delay == "today": 
        end = begin - DT.timedelta(days=1)
    elif delay == "week": 
        end = begin - DT.timedelta(days=7)
    elif delay == "month": 
        end = begin - DT.timedelta(days=30)
    try: 
        async with aiohttp.ClientSession() as session:
            async with session.post('https://api-seller.ozon.ru/v1/analytics/data',json={"date_from": end.strftime("%Y-%m-%d"),
                "date_to": begin.strftime("%Y-%m-%d"),
                "metrics": [
                    "revenue",
                    "ordered_units"
                ],
                "dimension": [
                    "day"
                ],
                "sort": [
                    {
                        "key": "ordered_units",
                        "order": "ASC"
                    }
                ],
                "limit": 1000,
                "offset": 0}, headers=headers_oz) as r:
                resp = await r.json()
                for item in resp["result"]["data"]: 
                    metrics["date"].append(item["dimensions"][0]["id"])
                    metrics["metrics"].append(item["metrics"])
            return metrics
    except Exception as e: 
        return {"status" : "ratelimit", "message": str(e)}
    
    
def parse_date(d_item):
    return datetime.strptime(d_item['date'], '%Y-%m-%dT%H:%M:%S')
    
async def get_wb_metrics(user, delay) : 
    # https://seller-analytics-api.wildberries.ru/api/v2/nm-report/detail
    headers_wb = {"Authorization": user.wb_token}
    wb_metrics = {"date": [], "metrics": []}
    begin = DT.date.today()
    end = DT.date.today()
    if delay == "today": 
        end = begin - DT.timedelta(days=1)
    elif delay == "week": 
        end = begin - DT.timedelta(days=7)
    elif delay == "month": 
        end = begin - DT.timedelta(days=30)
    
    try: 
        url = 'https://statistics-api.wildberries.ru/api/v1/supplier/orders?dateFrom='+end.strftime("%Y-%m-%d")+'&dateTo='+begin.strftime("%Y-%m-%d")
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers_wb) as r:
                resp = await r.json()
                print(resp)
                items = sorted(resp, key=parse_date)
                for item in items: 
                    wb_metrics["date"].append(item["date"].split('T')[0])
                    wb_metrics["metrics"].append([1, item["finishedPrice"]])
                return wb_metrics
    except Exception as e: 
        return {"status" : "ratelimit", "message": str(e)}
    