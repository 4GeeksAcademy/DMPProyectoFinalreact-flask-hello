import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from api.models import db
from api.routes import api

# Inicializa la app
app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)

# Configuración de base de datos
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url.replace("postgres://", "postgresql://")
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializa la DB y las migraciones
db.init_app(app)
MIGRATE = Migrate(app, db)

# Registra Blueprint con prefijo /api
app.register_blueprint(api, url_prefix="/api")

# Endpoint raíz
@app.route("/")
def index():
    return jsonify({"message": "API funcionando correctamente"}), 200

# Este bloque solo corre si ejecutas directamente app.py
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)
