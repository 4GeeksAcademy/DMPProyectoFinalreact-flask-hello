from flask import Blueprint, request, jsonify
from .models import db, User, Product, CartItem, Favorite
from werkzeug.security import check_password_hash

api = Blueprint('api', __name__)

# Registro


@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    new_user = User(
        username=data["username"],
        email=data["email"]
    )
    new_user.set_password(data["password"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

# Login


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Credenciales inválidas"}), 401

    return jsonify({"token": "fake-jwt-token", "user": user.serialize()}), 200

# Obtener todos los productos


@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.serialize() for p in products]), 200

# Agregar un nuevo producto


@api.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    new_product = Product(
        nombre=data['nombre'],
        grupo=data['grupo'],
        anio=data['anio'],
        soporte=data['soporte']
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.serialize()), 201

# Carrito: Añadir producto


@api.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    new_item = CartItem(user_id=data['user_id'], product_id=data['product_id'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.serialize()), 201

# Carrito: Ver productos


@api.route('/cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('user_id')
    items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.serialize() for item in items]), 200

# Carrito: Eliminar producto


@api.route('/cart/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    item = CartItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Producto no encontrado en el carrito"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Producto eliminado del carrito"}), 200

# Favoritos: Añadir producto


@api.route('/favorites', methods=['POST'])
def add_to_favorites():
    data = request.get_json()
    new_fav = Favorite(user_id=data['user_id'], product_id=data['product_id'])
    db.session.add(new_fav)
    db.session.commit()
    return jsonify(new_fav.serialize()), 201

# Favoritos: Ver productos


@api.route('/favorites', methods=['GET'])
def get_favorites():
    user_id = request.args.get('user_id')
    items = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([item.serialize() for item in items]), 200

# Favoritos: Eliminar producto


@api.route('/favorites/<int:item_id>', methods=['DELETE'])
def remove_from_favorites(item_id):
    item = Favorite.query.get(item_id)
    if not item:
        return jsonify({"error": "Producto no encontrado en favoritos"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Producto eliminado de favoritos"}), 200

# Mensaje de prueba


@api.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hola desde Flask"})
