import re
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..models import Category
from ..schemas import CategoryCreate, CategoryUpdate


def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from name."""
    slug = name.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


def get_categories(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    parent_id: Optional[int] = None,
    is_active: Optional[bool] = None
) -> List[Category]:
    query = db.query(Category)
    
    if parent_id is not None:
        query = query.filter(Category.parent_id == parent_id)
    elif parent_id is None:
        # Get root categories by default
        query = query.filter(Category.parent_id.is_(None))
    
    if is_active is not None:
        query = query.filter(Category.is_active == is_active)
    
    return query.order_by(Category.sort_order, Category.name).offset(skip).limit(limit).all()


def get_category(db: Session, category_id: int) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_slug(db: Session, slug: str) -> Optional[Category]:
    return db.query(Category).filter(Category.slug == slug).first()


def create_category(db: Session, category: CategoryCreate) -> Category:
    slug = generate_slug(category.name)
    
    # Ensure unique slug
    existing = get_category_by_slug(db, slug)
    if existing:
        slug = f"{slug}-{db.query(Category).count() + 1}"
    
    db_category = Category(
        name=category.name,
        slug=slug,
        description=category.description,
        image=category.image,
        parent_id=category.parent_id,
        is_active=category.is_active,
        sort_order=category.sort_order
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def update_category(
    db: Session,
    category_id: int,
    category: CategoryUpdate
) -> Optional[Category]:
    db_category = get_category(db, category_id)
    if not db_category:
        return None
    
    update_data = category.model_dump(exclude_unset=True)
    
    # Update slug if name changed
    if 'name' in update_data:
        update_data['slug'] = generate_slug(update_data['name'])
    
    for field, value in update_data.items():
        setattr(db_category, field, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int) -> bool:
    db_category = get_category(db, category_id)
    if not db_category:
        return False
    
    db.delete(db_category)
    db.commit()
    return True


def get_category_tree(db: Session) -> List[Category]:
    """Get all categories with their subcategories."""
    return db.query(Category).filter(
        Category.parent_id.is_(None),
        Category.is_active == True
    ).order_by(Category.sort_order, Category.name).all()
