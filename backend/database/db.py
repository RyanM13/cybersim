from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

user = "postgres"
password = "MSUCOLT!"
host = "localhost"
port = 4000
database = "CyberSim"


# Claude: How do I connect my backend to my database
# with FastAPI still being able to work?

DATABASE_URL = "postgresql://{0}:{1}@{2}:{3}/{4}".format(
    user, password, host, port, database
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


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

if __name__ == "__main__":
    try:
        with engine.connect() as connection:
            print(f"Connected to {database} successfully")

    except Exception as ex:
        print("Connection failed:", ex)

