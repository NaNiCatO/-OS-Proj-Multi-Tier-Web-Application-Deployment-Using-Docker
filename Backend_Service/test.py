import psycopg2

try:
    # Establish a connection to the PostgreSQL database
    connection = psycopg2.connect(
        user="postgres",            # Username
        password="mysecretpassword",# Password
        host="localhost",           # Hostname where PostgreSQL server is running
        port="5432",                # Port on which PostgreSQL is running
        database="postgres" # Name of the database
    )
    
    # Create a cursor object using the connection
    cursor = connection.cursor()
    
    # Query to select all rows from the 'products' table
    select_query = "SELECT * FROM products;"
    
    # Execute the SELECT query
    cursor.execute(select_query)
    
    # Fetch all rows from the result set
    rows = cursor.fetchall()
    
    # Print each row
    for row in rows:
        print("Code:", row[0])
        print("Name:", row[1])
        print("Price:", row[2])
        print("Category:", row[3])
        print("Available:", row[4])
        print("\n")
    
    print("Data selected successfully")

except (Exception, psycopg2.Error) as error:
    print("Error while connecting to PostgreSQL or executing queries:", error)

finally:
    # Close communication with the database
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed.")
