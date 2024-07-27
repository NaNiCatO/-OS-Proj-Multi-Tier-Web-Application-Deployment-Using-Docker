from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Configure the PostgreSQL database connection
DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'postgresql+psycopg2://postgres:mysecretpassword@localhost:5432/postgres')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the Product model
class Product(db.Model):    
    __tablename__ = 'products'
    code = db.Column(db.String, primary_key=True)  # VARCHAR in SQL
    name = db.Column(db.String, nullable=False)     # VARCHAR NOT NULL in SQL
    price = db.Column(db.Integer, nullable=False)   # INTEGER NOT NULL in SQL
    category = db.Column(db.String, nullable=False) # VARCHAR NOT NULL in SQL
    available = db.Column(db.Boolean, nullable=False) # BOOLEAN NOT NULL in SQL


@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Hello, World!"})


@app.route('/products', methods=['GET'])
def get_products():
    print("products_all")
    try:
        # Query all products
        products = Product.query.all()
        
        # Format the data as a list of dictionaries
        products_list = [{
            "code": product.code,
            "name": product.name,
            "price": product.price,
            "category": product.category,
            "available": product.available
        } for product in products]
        
        return jsonify(products_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/create', methods=['POST'])
def create_product():
    try:
        # Extract data from the JSON request body
        data = request.json
        if not data:
            return jsonify({"error": "Invalid input"}), 400
        
        # Extract fields from the request data
        code = data.get('code')
        name = data.get('name')
        price = data.get('price')
        category = data.get('category')
        available = data.get('available')
        
        # Check if a product with the same code already exists
        if Product.query.filter_by(code=code).first():
            return jsonify({"error": "Product with this code already exists."}), 400

        # Create and save the new product
        product = Product(
            code=code,
            name=name,
            price=price,
            category=category,
            available=available
        )
        db.session.add(product)
        db.session.commit()

        # Return a success response
        return jsonify(data), 201

    except Exception as e:
        # Handle and return error information
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
