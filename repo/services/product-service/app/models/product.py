from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    image = Column(String(255), nullable=True)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Self-referential relationship for subcategories
    parent = relationship("Category", remote_side=[id], backref="subcategories")
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    price = Column(DECIMAL(12, 2), nullable=False)
    compare_price = Column(DECIMAL(12, 2), nullable=True)  # Original price for discounts
    cost_price = Column(DECIMAL(12, 2), nullable=True)
    stock = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=5)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    seller_id = Column(String(36), nullable=False, index=True)  # UUID from User Service
    brand = Column(String(100), nullable=True, index=True)
    images = Column(JSON, default=list)  # Array of image URLs
    attributes = Column(JSON, default=dict)  # Product attributes (color, size, etc.)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    rating = Column(DECIMAL(2, 1), default=0)
    review_count = Column(Integer, default=0)
    sold_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    category = relationship("Category", back_populates="products")


class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(String(36), nullable=False)  # UUID from User Service
    rating = Column(Integer, nullable=False)  # 1-5
    title = Column(String(255), nullable=True)
    comment = Column(Text, nullable=True)
    images = Column(JSON, default=list)
    is_verified_purchase = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=True)
    helpful_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    product = relationship("Product")
