from pydantic import BaseModel

from typing import  Optional


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class UserChange(UserBase):
    password: str
    wb_token: str
    ozon_token: str

class SetSettings(BaseModel):
    wb_token: str | None = None
    oz_token : str | None = None
    email: str | None = None
    password: str | None = None

class GetStats(BaseModel):
    delay: str 