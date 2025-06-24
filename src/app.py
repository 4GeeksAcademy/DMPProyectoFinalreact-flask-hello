import os
import stripe

from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from api.models import db, Product
from api.routes import api as api_blueprint
from flask_jwt_extended import JWTManager




app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)

# Configuración de base de datos
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "../database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["JWT_SECRET_KEY"] = "clave-secreta-supersegura"  # Usa una clave más segura en producción
jwt = JWTManager(app)

# Inicializa SQLAlchemy y migraciones
db.init_app(app)
MIGRATE = Migrate(app, db)



stripe.api_key = "TU_CLAVE_SECRETA_DE_STRIPE"  # comienza con "sk_test_..."




# Registra el blueprint
app.register_blueprint(api_blueprint, url_prefix="/api")

@app.route("/")
def index():
    return jsonify({"message": "API funcionando correctamente"}), 200

def precargar_productos():
    if Product.query.count() == 0:
        productos_demo = [
            Product(nombre="Thriller", grupo="Michael Jackson", anio=1982, soporte="vinilo", precio=20.0,
                    imagen_url="https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
                    descripcion="El álbum más vendido de la historia. Un hito del pop con temas inmortales como 'Beat It' y 'Billie Jean'."),
            Product(nombre="Revolver", grupo="The Beatles", anio=1966, soporte="disco", precio=15.0,
                    imagen_url="https://tse1.mm.bing.net/th?id=OIP.wLcepunghj8qjoyr1WV4iwHaHa&w=474&h=474&c=7",
                    descripcion="Un antes y un después en la historia del rock. Psicodelia, innovación y letras brillantes definen este clásico de The Beatles."),
            Product(nombre="Back in Black", grupo="AC/DC", anio=1980, soporte="vinilo", precio=20.0,
                    imagen_url="https://tse3.mm.bing.net/th?id=OIP.ZOnsmkdhGIUV3FPyTrfS_wHaHa&r=0&w=474&h=474&c=7",
                    descripcion="Uno de los discos más potentes del hard rock. Tributo a Bon Scott, cargado de riffs inolvidables."),
            Product(nombre="The Dark Side of the Moon", grupo="Pink Floyd", anio=1973, soporte="disco", precio=15.0,
                    imagen_url="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
                    descripcion="Una experiencia sonora. Psicodelia, existencialismo y producción revolucionaria hacen de este álbum una obra maestra."),
            Product(nombre="Rumours", grupo="Fleetwood Mac", anio=1977, soporte="vinilo", precio=20.0,
                    imagen_url="https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
                    descripcion="Pasiones, rupturas y armonías vocales perfectas. Uno de los discos más sinceros y aclamados de los 70."),
            Product(nombre="Nevermind", grupo="Nirvana", anio=1991, soporte="virtual", precio=8.0,
                    imagen_url="https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
                    descripcion="El grunge hecho arte. La voz de toda una generación que explotó con 'Smells Like Teen Spirit'."),
            Product(nombre="Hotel California", grupo="Eagles", anio=1976, soporte="disco", precio=15.0,
                    imagen_url="https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg",
                    descripcion="Rock suave y letras misteriosas en uno de los álbumes más vendidos y emblemáticos de los 70."),
            Product(nombre="Abbey Road", grupo="The Beatles", anio=1969, soporte="virtual", precio=8.0,
                    imagen_url="https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
                    descripcion="Último álbum grabado por los Beatles. Su portada es icónica y su música, inolvidable."),
            Product(nombre="Born to Run", grupo="Bruce Springsteen", anio=1975, soporte="vinilo", precio=20.0,
                    imagen_url="https://tse4.mm.bing.net/th?id=OIP.QMIzYA1ep5IDjI5A3I3IVQHaHc&w=474&h=474&c=7",
                    descripcion="El himno del rock americano. Intensidad, carretera y sueños encapsulados en un solo disco."),
            Product(nombre="21", grupo="Adele", anio=2011, soporte="virtual", precio=8.0,
                    imagen_url="https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png",
                    descripcion="Una voz desgarradora y letras profundas sobre el desamor. El disco que consagró a Adele mundialmente."),
        ]
        db.session.bulk_save_objects(productos_demo)
        db.session.commit()
        print("🎉 Productos demo añadidos")

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    with app.app_context():
        db.drop_all()      # ⚠️ Solo en desarrollo
        db.create_all()
        precargar_productos()
    app.run(host="0.0.0.0", port=PORT, debug=True)

