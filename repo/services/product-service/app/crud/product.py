import re
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from decimal import Decimal
from ..models import Product, ProductReview
from ..schemas import ProductCreate, ProductUpdate, ReviewCreate


def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from name."""
    slug = name.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    category_id: Optional[int] = None,
    seller_id: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    is_active: bool = True,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> Tuple[List[Product], int]:
    query = db.query(Product)
    
    # Filters
    if is_active is not None:
        query = query.filter(Product.is_active == is_active)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if seller_id:
        query = query.filter(Product.seller_id == seller_id)
    
    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%")
            )
        )
    
    # Get total count
    total = query.count()
    
    # Sorting
    sort_column = getattr(Product, sort_by, Product.created_at)
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Pagination
    products = query.offset(skip).limit(limit).all()
    
    return products, total


def get_product(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()


def get_product_by_slug(db: Session, slug: str) -> Optional[Product]:
    return db.query(Product).filter(Product.slug == slug).first()


def get_product_by_sku(db: Session, sku: str) -> Optional[Product]:
    return db.query(Product).filter(Product.sku == sku).first()


def create_product(db: Session, product: ProductCreate, seller_id: str) -> Product:
    slug = generate_slug(product.name)
    
    # Ensure unique slug
    existing = get_product_by_slug(db, slug)
    if existing:
        slug = f"{slug}-{db.query(Product).count() + 1}"
    
    db_product = Product(
        name=product.name,
        slug=slug,
        description=product.description,
        short_description=product.short_description,
        sku=product.sku,
        price=product.price,
        compare_price=product.compare_price,
        cost_price=product.cost_price,
        stock=product.stock,
        low_stock_threshold=product.low_stock_threshold,
        category_id=product.category_id,
        seller_id=seller_id,
        brand=product.brand,
        images=product.images,
        attributes=product.attributes,
        is_active=product.is_active,
        is_featured=product.is_featured
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(
    db: Session,
    product_id: int,
    product: ProductUpdate,
    seller_id: Optional[str] = None
) -> Optional[Product]:
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    # Check ownership if seller_id provided
    if seller_id and db_product.seller_id != seller_id:
        return None
    
    update_data = product.model_dump(exclude_unset=True)
    
    # Update slug if name changed
    if 'name' in update_data:
        update_data['slug'] = generate_slug(update_data['name'])
    
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int, seller_id: Optional[str] = None) -> bool:
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    
    # Check ownership if seller_id provided
    if seller_id and db_product.seller_id != seller_id:
        return False
    
    db.delete(db_product)
    db.commit()
    return True


def update_stock(db: Session, product_id: int, quantity: int) -> Optional[Product]:
    """Update product stock (positive to add, negative to subtract)."""
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    new_stock = db_product.stock + quantity
    if new_stock < 0:
        return None  # Not enough stock
    
    db_product.stock = new_stock
    db.commit()
    db.refresh(db_product)
    return db_product


def increment_view_count(db: Session, product_id: int) -> None:
    """Increment product view count."""
    db.query(Product).filter(Product.id == product_id).update(
        {Product.view_count: Product.view_count + 1}
    )
    db.commit()


# ==========================================
# Reviews
# ==========================================

def get_product_reviews(
    db: Session,
    product_id: int,
    skip: int = 0,
    limit: int = 10
) -> Tuple[List[ProductReview], int]:
    query = db.query(ProductReview).filter(
        ProductReview.product_id == product_id,
        ProductReview.is_approved == True
    )
    
    total = query.count()
    reviews = query.order_by(desc(ProductReview.created_at)).offset(skip).limit(limit).all()
    
    return reviews, total


def create_review(
    db: Session,
    product_id: int,
    user_id: str,
    review: ReviewCreate,
    is_verified_purchase: bool = False
) -> ProductReview:
    db_review = ProductReview(
        product_id=product_id,
        user_id=user_id,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        images=review.images,
        is_verified_purchase=is_verified_purchase
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update product rating
    _update_product_rating(db, product_id)
    
    return db_review


def _update_product_rating(db: Session, product_id: int) -> None:
    """Recalculate product average rating."""
    from sqlalchemy import func
    
    result = db.query(
        func.avg(ProductReview.rating),
        func.count(ProductReview.id)
    ).filter(
        ProductReview.product_id == product_id,
        ProductReview.is_approved == True
    ).first()
    
    avg_rating, count = result
    
    db.query(Product).filter(Product.id == product_id).update({
        Product.rating: avg_rating or 0,
        Product.review_count: count or 0
    })
    db.commit()
