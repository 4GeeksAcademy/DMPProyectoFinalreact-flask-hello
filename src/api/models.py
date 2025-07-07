from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    grupo = db.Column(db.String(120), nullable=False)
    anio = db.Column(db.Integer, nullable=False)
    soporte = db.Column(db.String(20), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    imagen_url = db.Column(
        db.String, default="https://via.placeholder.com/300")
    descripcion = db.Column(db.Text, default="")  # NUEVO CAMPO

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "grupo": self.grupo,
            "anio": self.anio,
            "soporte": self.soporte,
            "precio": self.precio,
            "imagen_url": self.imagen_url,
            "descripcion": self.descripcion  # AÑADIDO
        }


class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(
        "product.id"), nullable=False)

    user = db.relationship("User", backref="cart_items")
    product = db.relationship("Product")

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.serialize(),
            "product": self.product.serialize()
        }


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(
        "product.id"), nullable=False)

    user = db.relationship("User", backref="favorites")
    product = db.relationship("Product")

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.serialize(),
            "product": self.product.serialize()
        }
