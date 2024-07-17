> ## writing raw SQL queries
> ```python
> from flask import Flask, jsonify
> import psycopg2
> 
> app = Flask(__name__)
> 
> # Database connection parameters
> DB_USER = "postgres"
> DB_PASSWORD = "mysecretpassword"
> DB_HOST = "localhost"
> DB_PORT = "5432"
> DB_NAME = "your_database_name"
> 
> def get_db_connection():
>     try:
>         connection = psycopg2.connect(
>             user=DB_USER,
>             password=DB_PASSWORD,
>             host=DB_HOST,
>             port=DB_PORT,
>             database=DB_NAME
>         )
>         return connection
>     except (Exception, psycopg2.Error) as error:
>         print("Error while connecting to PostgreSQL", error)
>         return None
> 
> @app.route('/products', methods=['GET'])
> def get_products():
>     connection = get_db_connection()
>     if connection is None:
>         return jsonify({"error": "Failed to connect to the database"}), 500
> 
>     cursor = connection.cursor()
>     try:
>         cursor.execute("SELECT * FROM products;")
>         rows = cursor.fetchall()
>         
>         products = []
>         for row in rows:
>             products.append({
>                 "code": row[0],
>                 "name": row[1],
>                 "price": row[2],
>                 "category": row[3],
>                 "available": row[4]
>             })
>         
>         return jsonify(products)
>     except (Exception, psycopg2.Error) as error:
>         print("Error while fetching data from PostgreSQL", error)
>         return jsonify({"error": "Failed to fetch data from the database"}), 500
>     finally:
>         cursor.close()
>         connection.close()
> 
> if __name__ == '__main__':
>     app.run(debug=True)
> ```

> ## SQLAlchemy allows you to interact with the database using Python objects <ins>instead of writing raw SQL queries</ins>.
>
> we import SQLAlchemy to more modular and maintainable in long term (but we just do a simple application wtf)
> ```python
> from flask import Flask, jsonify
> from flask_sqlalchemy import SQLAlchemy
> from sqlalchemy import create_engine
> from sqlalchemy.orm import sessionmaker
> import os
> 
> app = Flask(__name__)
> 
> # Configure the PostgreSQL database connection
> DATABASE_URI = 'postgresql+psycopg2://postgres:mysecretpassword@localhost:5432/your_database_name'
> app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
> app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
> 
> db = SQLAlchemy(app)
> 
> # Define the Product model
> class Product(db.Model):
>     __tablename__ = 'products'
>     code = db.Column(db.String(20), primary_key=True)
>     name = db.Column(db.String(50))
>     price = db.Column(db.Numeric)
>     category = db.Column(db.String(50))
>     available = db.Column(db.Boolean)
> 
> @app.route('/products', methods=['GET'])
> def get_products():
>     try:
>         # Query all products
>         products = Product.query.all()
>         
>         # Format the data as a list of dictionaries
>         products_list = [{
>             "code": product.code,
>             "name": product.name,
>             "price": product.price,
>             "category": product.category,
>             "available": product.available
>         } for product in products]
>         
>         return jsonify(products_list)
>     except Exception as e:
>         return jsonify({"error": str(e)}), 500
> 
> if __name__ == '__main__':
>     app.run(debug=True)
> ```