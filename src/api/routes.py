from flask import Blueprint, request, jsonify
from .models import db, User, Product, CartItem, Favorite
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re

api = Blueprint('api', __name__)

# ------------------ REGISTRO ------------------

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    if len(data.get("password")) < 8 or not re.search(r'[A-Za-z]', data.get("password")) or not re.search(r'\d', data.get("password")):
        return jsonify({"error": "La contraseña debe tener al menos 8 caracteres alfanuméricos"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    new_user = User(username=data["username"], email=data["email"])
    new_user.set_password(data["password"])
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201

# ------------------ LOGIN ------------------

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": user.serialize()}), 200

# ------------------ PRODUCTOS ------------------

@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.serialize() for p in products]), 200

@api.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    new_product = Product(
        nombre=data['nombre'],
        grupo=data['grupo'],
        anio=data['anio'],
        soporte=data['soporte'],
        precio=data.get('precio', 0),
        imagen_url=data.get('imagen_url', '')
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.serialize()), 201

# ------------------ CARRITO ------------------

@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_item = CartItem(user_id=user_id, product_id=data['product_id'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.serialize()), 201

@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.serialize() for item in items]), 200

@api.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    item = CartItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Producto no encontrado en el carrito"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Producto eliminado del carrito"}), 200

# ------------------ FAVORITOS ------------------

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_to_favorites():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_fav = Favorite(user_id=user_id, product_id=data['product_id'])
    db.session.add(new_fav)
    db.session.commit()
    return jsonify(new_fav.serialize()), 201

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    items = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([item.serialize() for item in items]), 200

@api.route('/favorites/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_favorites(item_id):
    item = Favorite.query.get(item_id)
    if not item:
        return jsonify({"error": "Producto no encontrado en favoritos"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Producto eliminado de favoritos"}), 200

# ------------------ TEST ------------------

@api.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hola desde Flask"})
