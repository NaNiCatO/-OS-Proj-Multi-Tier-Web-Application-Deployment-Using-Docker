import psycopg2

# Data to be inserted
products = [
    {'code': 'f230fh0g3', 'name': 'Bamboo Watch', 'price': 65, 'category': 'Accessories', 'available': True},
    {'code': 'nvklal433', 'name': 'Black Watch', 'price': 72, 'category': 'Accessories', 'available': True},
    {'code': 'zz21cz3c1', 'name': 'Blue Band', 'price': 79, 'category': 'Fitness', 'available': True},
    {'code': '244wgerg2', 'name': 'Blue T-Shirt', 'price': 29, 'category': 'Clothing', 'available': True},
    {'code': 'h456wer53', 'name': 'Golf Bag', 'price': 120, 'category': 'Sports', 'available': True},
    {'code': 'av2231fwg', 'name': 'Brown Purse', 'price': 150, 'category': 'Accessories', 'available': False},
    {'code': 'bib36pfvm', 'name': 'Running Shoes', 'price': 95, 'category': 'Sports', 'available': True},
    {'code': 'mbvjkgip5', 'name': 'Laptop Bag', 'price': 45, 'category': 'Accessories', 'available': False},
    {'code': 'vbb124btr', 'name': 'Yoga Mat', 'price': 20, 'category': 'Fitness', 'available': True},
    {'code': 'cm230f032', 'name': 'Gaming Chair', 'price': 200, 'category': 'Electronics', 'available': True}
]

# Connect to the PostgreSQL database
connection = None
try:
    connection = psycopg2.connect(
        user="postgres",
        password="mysecretpassword",
        host="db",
        port="5432",
        database="postgres"
    )
    cursor = connection.cursor()

    # Create the table
    create_table_query = '''CREATE TABLE IF NOT EXISTS products (
                                code VARCHAR PRIMARY KEY,
                                name VARCHAR NOT NULL,
                                price INTEGER NOT NULL,
                                category VARCHAR NOT NULL,
                                available BOOLEAN NOT NULL
                            );'''
    cursor.execute(create_table_query)
    connection.commit()
     
    # Insert data
    insert_query = '''INSERT INTO products (code, name, price, category, available)
                      VALUES (%s, %s, %s, %s, %s) ON CONFLICT (code) DO NOTHING;'''
    
    for product in products:
        cursor.execute(insert_query, (product['code'], product['name'], product['price'], product['category'], product['available']))
    
    connection.commit()

    print("Data inserted successfully")

except (Exception, psycopg2.Error) as error:
    print("Error while connecting to PostgreSQL", error)
finally:
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")
