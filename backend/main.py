import secrets
from fastapi import FastAPI
app = FastAPI()

SECRET_KEY = secrets.token_urlsafe(32)

@