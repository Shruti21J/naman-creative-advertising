
import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from pwdlib import PasswordHash
from sqlalchemy import text

from database import engine


# --------------------------------------------------
# 1. Load environment variables and configuration
# --------------------------------------------------

load_dotenv()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not ADMIN_USERNAME or not ADMIN_PASSWORD:
    raise RuntimeError("Admin credentials are missing from the .env file")

if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is missing from .env")

ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 30

password_hash = PasswordHash.recommended()
ADMIN_PASSWORD_HASH = password_hash.hash(ADMIN_PASSWORD)

bearer_scheme = HTTPBearer()


# --------------------------------------------------
# 2. Authentication helper
# --------------------------------------------------

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username = payload.get("sub")

        if username != ADMIN_USERNAME:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials",
            )

        return username

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )


# --------------------------------------------------
# 3. Create FastAPI application and configure CORS
# --------------------------------------------------

app = FastAPI(title="Naman Creative Advertising API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
    ],
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)


# --------------------------------------------------
# 4. Request models
# --------------------------------------------------

class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=100)
    description: str | None = None
    price: float | None = Field(default=None, ge=0)
    image_url: str | None = None
    moq: str | None = None


class EnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    phone: str = Field(min_length=10, max_length=30)
    product: str = Field(min_length=1, max_length=200)
    message: str | None = None


class AdminLogin(BaseModel):
    username: str
    password: str


class EnquiryStatusUpdate(BaseModel):
    status: str = Field(
        pattern="^(new|contacted|completed)$"
    )



# --------------------------------------------------
# 5. Public routes
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Naman Creative Advertising API is running!",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/products")
def get_products():
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT id, name, category, description, price, image_url, moq
                FROM products
                ORDER BY id
            """)
        )

        products = [
            {
                "id": row.id,
                "name": row.name,
                "category": row.category,
                "description": row.description,
                "price": float(row.price) if row.price is not None else None,
                "image_url": row.image_url,
                "moq": row.moq,
            }
            for row in result
        ]

    return {"products": products}


@app.post("/enquiries", status_code=201)
def create_enquiry(enquiry: EnquiryCreate):
    query = text("""
        INSERT INTO enquiries (name, phone, product, message)
        VALUES (:name, :phone, :product, :message)
        RETURNING id, name, phone, product, message, created_at, status
    """)

    with engine.begin() as connection:
        result = connection.execute(query, enquiry.model_dump())
        row = result.mappings().one()

    return {
        "message": "Enquiry submitted successfully",
        "enquiry": dict(row),
    }

@app.get("/admin/enquiries")
def get_admin_enquiries(
    current_admin: str = Depends(get_current_admin),
):
    query = text("""
        SELECT id, name, phone, product, message, created_at, status
        FROM enquiries
        ORDER BY created_at DESC
    """)

    with engine.connect() as connection:
        result = connection.execute(query)
        enquiries = [
            dict(row)
            for row in result.mappings()
        ]

    return {"enquiries": enquiries}


@app.patch("/admin/enquiries/{enquiry_id}/status")
def update_enquiry_status(
    enquiry_id: int,
    status_update: EnquiryStatusUpdate,
    current_admin: str = Depends(get_current_admin),
):
    query = text("""
        UPDATE enquiries
        SET status = :status
        WHERE id = :enquiry_id
        RETURNING id, name, product, status
    """)

    with engine.begin() as connection:
        result = connection.execute(
            query,
            {
                "status": status_update.status,
                "enquiry_id": enquiry_id,
            },
        )
        enquiry = result.mappings().one_or_none()

    if enquiry is None:
        raise HTTPException(
            status_code=404,
            detail="Enquiry not found",
        )

    return {
        "message": "Enquiry status updated successfully",
        "enquiry": dict(enquiry),
    }




# --------------------------------------------------
# 6. Admin login
# --------------------------------------------------

@app.post("/admin/login")
def admin_login(credentials: AdminLogin):
    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    if not password_hash.verify(
        credentials.password,
        ADMIN_PASSWORD_HASH,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_MINUTES
    )

    token = jwt.encode(
        {
            "sub": ADMIN_USERNAME,
            "exp": expires_at,
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_MINUTES * 60,
    }


# --------------------------------------------------
# 7. Protected admin product routes
# --------------------------------------------------

@app.post("/products", status_code=201)
def create_product(
    product: ProductCreate,
    current_admin: str = Depends(get_current_admin),
):
    query = text("""
        INSERT INTO products
            (name, category, description, price, image_url, moq)
        VALUES
            (:name, :category, :description, :price, :image_url, :moq)
        RETURNING id, name, category, description, price, image_url, moq
    """)

    with engine.begin() as connection:
        result = connection.execute(query, product.model_dump())
        row = result.mappings().one()

    return {
        "message": "Product created successfully",
        "product": {
            **dict(row),
            "price": float(row["price"]) if row["price"] is not None else None,
        },
    }


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate,
    current_admin: str = Depends(get_current_admin),
):
    query = text("""
        UPDATE products
        SET name = :name,
            category = :category,
            description = :description,
            price = :price,
            image_url = :image_url,
            moq = :moq
        WHERE id = :product_id
        RETURNING id, name, category, description, price, image_url, moq
    """)

    with engine.begin() as connection:
        result = connection.execute(
            query,
            {
                **product.model_dump(),
                "product_id": product_id,
            },
        )
        row = result.mappings().one_or_none()

    if row is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "message": "Product updated successfully",
        "product": {
            **dict(row),
            "price": float(row["price"]) if row["price"] is not None else None,
        },
    }


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_admin: str = Depends(get_current_admin),
):
    query = text("""
        DELETE FROM products
        WHERE id = :product_id
        RETURNING id, name
    """)

    with engine.begin() as connection:
        result = connection.execute(
            query,
            {"product_id": product_id},
        )
        deleted_product = result.mappings().one_or_none()

    if deleted_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "message": "Product deleted successfully",
        "deleted_product": dict(deleted_product),
    }
