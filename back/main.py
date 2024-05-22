from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Annotated, Union
import crud, models, schemas
from jose import JWTError, jwt
from database import SessionLocal, engine
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta, timezone
import aiohttp


import datetime as DT

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

models.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return False
    if not password == user.password:
        return False
    return user

async def check_token(token: str): 
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return True
    except JWTError:
        raise credentials_exception

async def get_current_user( token: Annotated[str, Depends(oauth2_scheme)] , db):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = username
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[schemas.User, Depends(get_current_user)],
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user



# create user 
@app.post("/users/", response_model=schemas.User)
def users(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/token")
async def token(
    form_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"token": access_token}

@app.get("/get_setting")
async def get_setting(
    token: str,
    db: Session = Depends(get_db)
):
    user = await get_current_user(token, db)
    if  user: 
        return { "wb_token": user.wb_token, "oz_token": user.ozon_token, "email": user.email}
    
@app.post("/check_token")
async def check_token(
    token: str,
    db: Session = Depends(get_db)
):
    user = await get_current_user(token, db)
    if  user: 
        return { "status": "ok", "email": user.email}
    

@app.post("/set_settings")
async def set_settings(
    token: str,
    settings: schemas.SetSettings,
    db: Session = Depends(get_db)
):
    user = await get_current_user(token, db)
    if user: 
        user_data = settings.model_dump(exclude_unset=True)
        for key, value in user_data.items():
            setattr(user, key, value)
        db.commit()
        return { "status": "ok"}
    
@app.post("/get_items")
async def get_items(
    token: str,
    db: Session = Depends(get_db)
):
    ozon_items = []
    wb_items = []
    user = await get_current_user(token, db)
    headers_oz = {"Client-Id": "1508094", "Api-Key": user.ozon_token, "Accept": "application/json"}
    headers_wb = {"Authorization": user.wb_token}
    
    if user: 
        # user.wb_token = wb_token
        # user.ozon_token = ozon_token\
        # client 1508094
        # ozon api c04ea722-d999-444b-bc79-abc1fbb6b6b1
        # wb eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQwMjI2djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTczMDUyMjQ3NCwiaWQiOiJiN2FmYWY0Ny0wMmFkLTQxNGMtODk0OC03NmVmODJlY2RmMmYiLCJpaWQiOjg1OTQzNDk4LCJvaWQiOjEzMzI0MTQsInMiOjEwNzM3NDI4NDYsInNpZCI6IjM4ODNhODc3LTcxNTMtNGI0NS05NTQxLTkwMmNiNjJlODZkYyIsInQiOmZhbHNlLCJ1aWQiOjg1OTQzNDk4fQ.R8uHu0-W-bMJJfPd0_NBz4RM0ZI-w5rNHMf4TOUbyR7YcH9oPKjz2usUmBuLIkuwhKxk420s8bfzy27lIMQQ0Q
        async with aiohttp.ClientSession() as session:
            async with session.post('https://api-seller.ozon.ru/v2/product/list',json={
                    "limit": 100
                    }, headers=headers_oz) as r:
                resp = await r.json()
                
                for item in resp["result"]["items"]: 
                    async with session.post('https://api-seller.ozon.ru/v2/product/info', json={
                        "product_id": item["product_id"]
                    }, headers=headers_oz) as r:
                        resp = await r.json()
                        new_item = resp["result"]
                        ozon_items.append({"type": "oz", "id" : new_item["id"],"name": new_item["name"], "image": new_item["primary_image"], "price": new_item["price"]})
        
            async with session.post('https://suppliers-api.wildberries.ru/content/v2/get/cards/list',json={
          "settings": {
            "cursor": {
              "limit": 100
            },
            "filter": {
              "withPhoto": -1
            }
          }
        }, headers=headers_wb) as r:
                resp = await r.json()
                for item in resp['cards']: 
                    wb_items.append({"type": "wb", "id" : item["nmID"],"name": item["title"], "image": item["photos"][0]["big"], "desc": item['description']})
        total = []
        total.extend(ozon_items)
        total.extend(wb_items)
        return  total
        
@app.post("/get_stats")
async def get_stats(
    token: str,
    getstats: schemas.GetStats,
    db: Session = Depends(get_db)
):
    user = await get_current_user(token, db)

    
    
    if user: 
        oz_metrics = await crud.get_ozon_metrics(user, getstats.delay)
        wb_metrics = await crud.get_wb_metrics(user, getstats.delay)        
        return {"wb": wb_metrics, "oz": oz_metrics}
