from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal

from ..database import get_db
from ..crud import product as product_crud
from ..schemas import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    ReviewCreate, ReviewResponse, PaginatedResponse
)

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=PaginatedResponse)
def get_products(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    category_id: Optional[int] = None,
    brand: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = Query(default="created_at", regex="^(created_at|price|rating|sold_count|name)$"),
    sort_order: str = Query(default="desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """Get all products with filtering, search, and pagination."""
    skip = (page - 1) * limit
    
    products, total = product_crud.get_products(
        db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        brand=brand,
        min_price=min_price,
        max_price=max_price,
        is_featured=is_featured,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    return {
        "items": products,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }


@router.get("/featured", response_model=List[ProductListResponse])
def get_featured_products(
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get featured products."""
    products, _ = product_crud.get_products(
        db, limit=limit, is_featured=True
    )
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product by ID."""
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Increment view count
    product_crud.increment_view_count(db, product_id)
    
    return product


@router.get("/slug/{slug}", response_model=ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a specific product by slug."""
    product = product_crud.get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_crud.increment_view_count(db, product.id)
    
    return product


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    product: ProductCreate,
    x_user_id: str = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db)
):
    """Create a new product (Seller/Admin)."""
    # Check if SKU already exists
    existing = product_crud.get_product_by_sku(db, product.sku)
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")
    
    return product_crud.create_product(db, product, seller_id=x_user_id)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    x_user_id: str = Header(..., alias="X-User-Id"),
    x_user_role: str = Header(default="USER", alias="X-User-Role"),
    db: Session = Depends(get_db)
):
    """Update a product (Owner or Admin)."""
    seller_id = None if x_user_role == "ADMIN" else x_user_id
    
    updated = product_crud.update_product(db, product_id, product, seller_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found or access denied")
    return updated


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    x_user_id: str = Header(..., alias="X-User-Id"),
    x_user_role: str = Header(default="USER", alias="X-User-Role"),
    db: Session = Depends(get_db)
):
    """Delete a product (Owner or Admin)."""
    seller_id = None if x_user_role == "ADMIN" else x_user_id
    
    success = product_crud.delete_product(db, product_id, seller_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found or access denied")
    return {"message": "Product deleted successfully"}


@router.patch("/{product_id}/stock")
def update_stock(
    product_id: int,
    quantity: int = Query(..., description="Positive to add, negative to subtract"),
    db: Session = Depends(get_db)
):
    """Update product stock (for Order Service)."""
    updated = product_crud.update_stock(db, product_id, quantity)
    if not updated:
        raise HTTPException(status_code=400, detail="Product not found or insufficient stock")
    return {"message": "Stock updated", "new_stock": updated.stock}


# ==========================================
# Reviews
# ==========================================

@router.get("/{product_id}/reviews", response_model=PaginatedResponse)
def get_product_reviews(
    product_id: int,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get reviews for a product."""
    # Verify product exists
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    skip = (page - 1) * limit
    reviews, total = product_crud.get_product_reviews(db, product_id, skip, limit)
    
    return {
        "items": reviews,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }


@router.post("/{product_id}/reviews", response_model=ReviewResponse, status_code=201)
def create_review(
    product_id: int,
    review: ReviewCreate,
    x_user_id: str = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db)
):
    """Create a review for a product."""
    # Verify product exists
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # TODO: Check if user has purchased the product
    is_verified = False
    
    return product_crud.create_review(db, product_id, x_user_id, review, is_verified)
