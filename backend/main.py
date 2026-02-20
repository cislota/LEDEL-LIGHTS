from fastapi import FastAPI
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas
from .database import get_db

app = FastAPI()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):
    # Controller получает данные из Model
    products = db.query(models.Product).all()
    return products

@app.get("/api/products/{slug}")
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.slug == slug).first()
    return product