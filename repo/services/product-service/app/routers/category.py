from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..crud import category as category_crud
from ..schemas import (
    CategoryCreate, CategoryUpdate, CategoryResponse, CategoryWithSubcategories
)

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
def get_categories(
    parent_id: Optional[int] = None,
    is_active: Optional[bool] = True,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all categories with optional filtering."""
    categories = category_crud.get_categories(
        db, skip=skip, limit=limit, parent_id=parent_id, is_active=is_active
    )
    return categories


@router.get("/tree", response_model=List[CategoryWithSubcategories])
def get_category_tree(db: Session = Depends(get_db)):
    """Get category tree structure."""
    return category_crud.get_category_tree(db)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get a specific category by ID."""
    category = category_crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/slug/{slug}", response_model=CategoryResponse)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a specific category by slug."""
    category = category_crud.get_category_by_slug(db, slug)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("", response_model=CategoryResponse, status_code=201)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
    # TODO: Add admin authentication
):
    """Create a new category (Admin only)."""
    return category_crud.create_category(db, category)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db)
    # TODO: Add admin authentication
):
    """Update a category (Admin only)."""
    updated = category_crud.update_category(db, category_id, category)
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
    # TODO: Add admin authentication
):
    """Delete a category (Admin only)."""
    success = category_crud.delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}
