from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Database variables. Need to move to .env
user = "postgres"
password = "MSUCOLT!"
host = "localhost"
port = 4000
database = "CyberSim"


# Claude: How do I connect my backend to my database
# with FastAPI still being able to work?

# sqlalchemy connection to database
DATABASE_URL = "postgresql://{0}:{1}@{2}:{3}/{4}".format(
    user, password, host, port, database
)

# Createse the connection to the database for sqlalchemy  
engine = create_engine(DATABASE_URL)
# Creates a tempory worksspace 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Links my models to the database tables
class Base(DeclarativeBase):
    pass


# FastAPI uses this for database connection between routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Test block
# Source: https://www.geeksforgeeks.org/python/connecting-to-sql-database-using-sqlalchemy-in-python/

# Log to terminal to see sucessful connection to db
if __name__ == "__main__":
    try:
        with engine.connect() as connection:
            print(f"Connected to {database} successfully")

    except Exception as ex:
        print("Connection failed:", ex)

