import os
from flask import Flask, request, jsonify
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, Column, String, Integer, Boolean, asc, desc
from sqlalchemy.ext.declarative import declarative_base

app = Flask(__name__)

# Read DATABASE_URI from environment variable
DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'postgresql+psycopg2://postgres:mysecretpassword@localhost:5432/postgres')

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

Base = declarative_base()

class Product(Base):
    __tablename__ = 'products'
    code = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    available = Column(Boolean, nullable=False)

# Setup the engine and session using DATABASE_URI
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)


@app.route('/', methods=['GET'])
def home():
    return 'Welcome to the Products Service!'


@app.route('/products', methods=['GET'])
def get_products():
    session = Session()
    query = session.query(Product)

    # Extract query parameters
    name = request.args.get('name', '')
    price = request.args.get('price', None)
    order_by = request.args.get('order_by', 'asc')
    category = request.args.get('category', '')
    available = request.args.get('available', 'true').lower() in ['true', '1', 't', 'y', 'yes']

    # Apply filters
    if name:
        query = query.filter(Product.name.ilike(f'{name}%'))
    if category:
        query = query.filter(Product.category.ilike(f'%{category}%'))
    query = query.filter(Product.available == available)

    # Apply sorting based on price
    if price:
        if order_by.lower() == 'asc':
            query = query.order_by(asc(Product.price))
        elif order_by.lower() == 'desc':
            query = query.order_by(desc(Product.price))

    products = query.all()
    
    results = [
        {
            'code': product.code,
            'name': product.name,
            'price': product.price,
            'category': product.category,
            'available': product.available
        }
        for product in products
    ]

    session.close()
    return jsonify(results)

@app.route('/all-products', methods=['GET'])
def get_all_products():
    session = Session()
    products = session.query(Product).all()
    
    results = [
        {
            'code': product.code,
            'name': product.name,
            'price': product.price,
            'category': product.category,
            'available': product.available
        }
        for product in products
    ]

    session.close()
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
