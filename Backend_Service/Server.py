from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Configure the PostgreSQL database connection
# DATABASE_URI = 'postgresql+psycopg2://postgres:mysecretpassword@localhost:5432/postgres'
# app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
