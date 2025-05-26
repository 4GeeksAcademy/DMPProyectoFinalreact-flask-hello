from flask import Blueprint
from .auth_routes import auth_api

api = Blueprint('api', __name__)
api.register_blueprint(auth_api)
