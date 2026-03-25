# Backend configuration
import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://ledl_user:ledl_pass@localhost:5432/ledl_db"
)

# Tilda API
TILDA_API_URL = os.getenv(
    "TILDA_API_URL",
    "https://store.tildacdn.com/api/getproductslist/"
)
TILDA_STORE_PART_UID = os.getenv("TILDA_STORE_PART_UID", "508199045462")
TILDA_RECID = os.getenv("TILDA_RECID", "766672722")

# App settings
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))

# CORS
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")
