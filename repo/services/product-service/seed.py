"""
Seed data script for Product Service
Run: python seed.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import Category, Product, ProductReview
from datetime import datetime
import random

# Create tables
Base.metadata.create_all(bind=engine)

# Categories data
categories_data = [
    {"name": "Telefonlar", "slug": "telefonlar", "description": "Smartfonlar va mobil qurilmalar", "image": "📱"},
    {"name": "Noutbuklar", "slug": "noutbuklar", "description": "Noutbuk va kompyuterlar", "image": "💻"},
    {"name": "Televizorlar", "slug": "televizorlar", "description": "Smart TV va televizorlar", "image": "📺"},
    {"name": "Audio", "slug": "audio", "description": "Quloqchinlar va audio qurilmalar", "image": "🎧"},
    {"name": "Planshetlar", "slug": "planshetlar", "description": "Planshet kompyuterlar", "image": "📱"},
    {"name": "Gaming", "slug": "gaming", "description": "O'yin konsollari va aksessuarlar", "image": "🎮"},
    {"name": "Maishiy texnika", "slug": "maishiy-texnika", "description": "Uy uchun texnika", "image": "🏠"},
    {"name": "Kiyimlar", "slug": "kiyimlar", "description": "Erkaklar va ayollar kiyimlari", "image": "👕"},
]

# Products data with real images
products_data = [
    # Telefonlar
    {
        "name": "iPhone 15 Pro Max 256GB Natural Titanium",
        "slug": "iphone-15-pro-max-256gb",
        "short_description": "A17 Pro chip, titanium design, 48MP camera",
        "description": """iPhone 15 Pro Max - Apple'ning eng kuchli smartfoni.

Xususiyatlari:
• A17 Pro chip - eng tez mobil protsessor
• 48MP asosiy kamera + 12MP ultra wide + 12MP telephoto
• 6.7" Super Retina XDR OLED display
• Titanium korpus - engil va mustahkam
• USB-C port
• 29 soatgacha video ko'rish
• Action button

Kafolat: 1 yil""",
        "sku": "IPHONE15PROMAX256NT",
        "price": 17500000,
        "compare_price": 19000000,
        "stock": 25,
        "category_slug": "telefonlar",
        "brand": "Apple",
        "is_featured": True,
        "images": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800"
    },
    {
        "name": "Samsung Galaxy S24 Ultra 512GB Titanium Black",
        "slug": "samsung-galaxy-s24-ultra",
        "short_description": "Galaxy AI, S Pen, 200MP camera",
        "description": """Samsung Galaxy S24 Ultra - AI kuchiga ega flagship.

Xususiyatlari:
• Snapdragon 8 Gen 3 protsessor
• 200MP asosiy kamera
• 6.8" Dynamic AMOLED 2X display
• Galaxy AI - aqlli yordamchi
• S Pen qo'llab-quvvatlash
• 5000mAh batareya
• IP68 suv va changdan himoya

Kafolat: 2 yil""",
        "sku": "SAMSUNGS24ULTRA512",
        "price": 16800000,
        "compare_price": 18500000,
        "stock": 30,
        "category_slug": "telefonlar",
        "brand": "Samsung",
        "is_featured": True,
        "images": "https://images.samsung.com/is/image/samsung/p6pim/uz/2401/gallery/uz-galaxy-s24-s928-sm-s928bztqskz-thumb-539295631"
    },
    {
        "name": "Xiaomi 14 Pro 512GB Black",
        "slug": "xiaomi-14-pro",
        "short_description": "Leica camera, Snapdragon 8 Gen 3",
        "description": """Xiaomi 14 Pro - professional kamerali smartfon.

Xususiyatlari:
• Leica professional kamera tizimi
• Snapdragon 8 Gen 3
• 6.73" LTPO AMOLED display
• 120W tez quvvatlash
• 4880mAh batareya

Kafolat: 1 yil""",
        "sku": "XIAOMI14PRO512",
        "price": 12500000,
        "compare_price": 14000000,
        "stock": 40,
        "category_slug": "telefonlar",
        "brand": "Xiaomi",
        "is_featured": True,
        "images": ""
    },
    # Noutbuklar
    {
        "name": "MacBook Pro 14\" M3 Pro 18GB 512GB Space Gray",
        "slug": "macbook-pro-14-m3-pro",
        "short_description": "M3 Pro chip, 18GB RAM, professional ish uchun",
        "description": """MacBook Pro 14" M3 Pro - professionallar uchun.

Xususiyatlari:
• Apple M3 Pro chip (12-core CPU, 18-core GPU)
• 18GB unified memory
• 512GB SSD
• 14.2" Liquid Retina XDR display
• 17 soatgacha batareya
• MagSafe 3, 3x Thunderbolt 4, HDMI, SD card slot

Kafolat: 1 yil""",
        "sku": "MACBOOKPRO14M3PRO",
        "price": 32000000,
        "compare_price": None,
        "stock": 15,
        "category_slug": "noutbuklar",
        "brand": "Apple",
        "is_featured": True,
        "images": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=800"
    },
    {
        "name": "ASUS ROG Strix G16 RTX 4070 i9-13980HX",
        "slug": "asus-rog-strix-g16",
        "short_description": "Gaming noutbuk, RTX 4070, 165Hz",
        "description": """ASUS ROG Strix G16 - o'yinlar uchun maxsus.

Xususiyatlari:
• Intel Core i9-13980HX
• NVIDIA RTX 4070 8GB
• 16GB DDR5 RAM
• 1TB SSD
• 16" QHD 165Hz display
• RGB klaviatura

Kafolat: 2 yil""",
        "sku": "ASUSROGSTRIXG16",
        "price": 28500000,
        "compare_price": 32000000,
        "stock": 10,
        "category_slug": "noutbuklar",
        "brand": "ASUS",
        "is_featured": True,
        "images": ""
    },
    {
        "name": "Lenovo ThinkPad X1 Carbon Gen 11 i7",
        "slug": "lenovo-thinkpad-x1-carbon",
        "short_description": "Biznes noutbuk, engil va kuchli",
        "description": """ThinkPad X1 Carbon - biznes uchun ideal.

Xususiyatlari:
• Intel Core i7-1365U
• 16GB LPDDR5 RAM
• 512GB SSD
• 14" 2.8K OLED display
• 1.12kg og'irlik
• Fingerprint + IR kamera

Kafolat: 3 yil""",
        "sku": "THINKPADX1CARBON11",
        "price": 24000000,
        "compare_price": None,
        "stock": 12,
        "category_slug": "noutbuklar",
        "brand": "Lenovo",
        "is_featured": False,
        "images": ""
    },
    # Audio
    {
        "name": "Sony WH-1000XM5 Wireless Headphones Black",
        "slug": "sony-wh1000xm5-black",
        "short_description": "Industry-leading noise cancellation",
        "description": """Sony WH-1000XM5 - eng yaxshi shovqinni bekor qilish.

Xususiyatlari:
• Industry-leading noise cancellation
• 30 soatgacha batareya
• Hi-Res Audio
• Speak-to-Chat
• Multipoint connection
• Ultra comfortable design

Kafolat: 1 yil""",
        "sku": "SONYWH1000XM5BLK",
        "price": 4200000,
        "compare_price": 4800000,
        "stock": 50,
        "category_slug": "audio",
        "brand": "Sony",
        "is_featured": True,
        "images": "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1500_.jpg"
    },
    {
        "name": "Apple AirPods Pro 2nd Generation USB-C",
        "slug": "airpods-pro-2-usbc",
        "short_description": "Active Noise Cancellation, Spatial Audio",
        "description": """AirPods Pro 2 - eng yaxshi true wireless.

Xususiyatlari:
• Active Noise Cancellation
• Adaptive Transparency
• Spatial Audio with head tracking
• USB-C charging case
• 6 soat batareya (30 soat case bilan)
• IP54 suv va terdan himoya

Kafolat: 1 yil""",
        "sku": "AIRPODSPRO2USBC",
        "price": 3200000,
        "compare_price": 3500000,
        "stock": 60,
        "category_slug": "audio",
        "brand": "Apple",
        "is_featured": True,
        "images": ""
    },
    # Gaming
    {
        "name": "Sony PlayStation 5 Slim 1TB",
        "slug": "playstation-5-slim",
        "short_description": "Next-gen gaming, 4K 120fps",
        "description": """PlayStation 5 Slim - yangi avlod o'yinlari.

Xususiyatlari:
• Custom AMD CPU/GPU
• 1TB SSD
• 4K 120fps support
• Ray Tracing
• DualSense controller
• 30% kichikroq dizayn

Kafolat: 1 yil""",
        "sku": "PS5SLIM1TB",
        "price": 8500000,
        "compare_price": 9500000,
        "stock": 20,
        "category_slug": "gaming",
        "brand": "Sony",
        "is_featured": True,
        "images": ""
    },
    {
        "name": "Nintendo Switch OLED Model White",
        "slug": "nintendo-switch-oled",
        "short_description": "7\" OLED screen, portable gaming",
        "description": """Nintendo Switch OLED - eng yaxshi portable.

Xususiyatlari:
• 7" OLED display
• 64GB internal storage
• Enhanced audio
• Wide adjustable stand
• LAN port dock
• Joy-Con controllers

Kafolat: 1 yil""",
        "sku": "SWITCHOLEDWHITE",
        "price": 5200000,
        "compare_price": None,
        "stock": 25,
        "category_slug": "gaming",
        "brand": "Nintendo",
        "is_featured": False,
        "images": ""
    },
    # Planshetlar
    {
        "name": "iPad Pro 12.9\" M2 256GB Wi-Fi Space Gray",
        "slug": "ipad-pro-129-m2",
        "short_description": "M2 chip, Liquid Retina XDR display",
        "description": """iPad Pro 12.9" - eng kuchli planshet.

Xususiyatlari:
• Apple M2 chip
• 12.9" Liquid Retina XDR display
• 256GB storage
• 12MP + 10MP kameralar
• Face ID
• Apple Pencil 2 support
• Magic Keyboard support

Kafolat: 1 yil""",
        "sku": "IPADPRO129M2256",
        "price": 15500000,
        "compare_price": 17000000,
        "stock": 18,
        "category_slug": "planshetlar",
        "brand": "Apple",
        "is_featured": True,
        "images": ""
    },
    {
        "name": "Samsung Galaxy Tab S9 Ultra 512GB",
        "slug": "galaxy-tab-s9-ultra",
        "short_description": "14.6\" AMOLED, S Pen included",
        "description": """Galaxy Tab S9 Ultra - katta ekranli planshet.

Xususiyatlari:
• 14.6" Dynamic AMOLED 2X display
• Snapdragon 8 Gen 2
• 12GB RAM + 512GB storage
• S Pen included
• IP68 water resistance
• DeX mode

Kafolat: 1 yil""",
        "sku": "TABS9ULTRA512",
        "price": 14800000,
        "compare_price": None,
        "stock": 15,
        "category_slug": "planshetlar",
        "brand": "Samsung",
        "is_featured": False,
        "images": ""
    },
    # Televizorlar
    {
        "name": "Samsung 65\" Neo QLED 4K QN90C",
        "slug": "samsung-65-neo-qled-qn90c",
        "short_description": "Neo Quantum Processor, 120Hz",
        "description": """Samsung Neo QLED - premium TV.

Xususiyatlari:
• 65" 4K display
• Neo Quantum Processor
• 120Hz refresh rate
• Dolby Atmos
• Gaming Hub
• Smart TV features

Kafolat: 2 yil""",
        "sku": "SAMSUNGQN90C65",
        "price": 22000000,
        "compare_price": 25000000,
        "stock": 8,
        "category_slug": "televizorlar",
        "brand": "Samsung",
        "is_featured": True,
        "images": ""
    },
    {
        "name": "LG 55\" OLED evo C3 4K Smart TV",
        "slug": "lg-55-oled-c3",
        "short_description": "Perfect blacks, α9 AI Processor",
        "description": """LG OLED C3 - mukammal qora ranglar.

Xususiyatlari:
• 55" 4K OLED display
• α9 AI Processor Gen6
• 120Hz, VRR, ALLM
• Dolby Vision IQ & Atmos
• webOS 23
• 4x HDMI 2.1

Kafolat: 2 yil""",
        "sku": "LGOLEDC355",
        "price": 18500000,
        "compare_price": 20000000,
        "stock": 10,
        "category_slug": "televizorlar",
        "brand": "LG",
        "is_featured": False,
        "images": ""
    },
    # Maishiy texnika
    {
        "name": "Dyson V15 Detect Absolute",
        "slug": "dyson-v15-detect",
        "short_description": "Laser dust detection, LCD screen",
        "description": """Dyson V15 Detect - eng aqlli changyutgich.

Xususiyatlari:
• Laser dust detection
• Piezo sensor
• LCD real-time display
• 60 daqiqa ishlash vaqti
• HEPA filtration
• 5 different attachments

Kafolat: 2 yil""",
        "sku": "DYSONV15DETECT",
        "price": 9500000,
        "compare_price": 11000000,
        "stock": 12,
        "category_slug": "maishiy-texnika",
        "brand": "Dyson",
        "is_featured": True,
        "images": ""
    },
    # More products
    {
        "name": "Apple Watch Series 9 45mm GPS Midnight",
        "slug": "apple-watch-series-9-45mm",
        "short_description": "S9 SiP, Double tap gesture",
        "description": """Apple Watch Series 9 - eng aqlli soat.

Xususiyatlari:
• S9 SiP dual-core processor
• Always-On Retina display
• Double tap gesture
• Blood oxygen & ECG
• Crash Detection
• 18 soatgacha batareya

Kafolat: 1 yil""",
        "sku": "AWSERIES945MIDNIGHT",
        "price": 6500000,
        "compare_price": None,
        "stock": 30,
        "category_slug": "telefonlar",
        "brand": "Apple",
        "is_featured": False,
        "images": ""
    },
]


def seed_database():
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(ProductReview).delete()
        db.query(Product).delete()
        db.query(Category).delete()
        db.commit()
        
        print("🗑️  Cleared existing data")
        
        # Create categories
        category_map = {}
        for cat_data in categories_data:
            category = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["description"],
                image=cat_data["image"],
                is_active=True
            )
            db.add(category)
            db.flush()
            category_map[cat_data["slug"]] = category.id
            print(f"✅ Category: {cat_data['name']}")
        
        db.commit()
        print(f"\n📁 Created {len(categories_data)} categories")
        
        # Create products
        for prod_data in products_data:
            cat_id = category_map.get(prod_data["category_slug"])
            if not cat_id:
                print(f"⚠️  Category not found for: {prod_data['name']}")
                continue
            
            product = Product(
                name=prod_data["name"],
                slug=prod_data["slug"],
                description=prod_data["description"],
                short_description=prod_data["short_description"],
                sku=prod_data["sku"],
                price=prod_data["price"],
                compare_price=prod_data.get("compare_price"),
                stock=prod_data["stock"],
                category_id=cat_id,
                brand=prod_data.get("brand"),
                images=prod_data.get("images", ""),
                rating=round(random.uniform(4.5, 5.0), 1),
                review_count=random.randint(50, 500),
                sold_count=random.randint(100, 2000),
                is_featured=prod_data.get("is_featured", False),
                is_active=True
            )
            db.add(product)
            print(f"✅ Product: {prod_data['name'][:50]}...")
        
        db.commit()
        print(f"\n📦 Created {len(products_data)} products")
        
        print("\n🎉 Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
