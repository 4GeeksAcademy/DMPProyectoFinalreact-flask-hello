from flask import Blueprint, request, jsonify
from src.api.models.user import User
from src.api.db.database import db

auth_api = Blueprint('auth_api', __name__)

# Registro de usuario
@auth_api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Faltan campos"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El email ya existe"}), 400

    new_user = User(
        username=data["username"],
        email=data["email"]
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

# Obtener todos los usuarios (solo para pruebas o admin)
@auth_api.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

# Actualizar usuario
@auth_api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)

    if data.get("password"):
        user.set_password(data["password"])

    db.session.commit()
    return jsonify(user.serialize()), 200

# Eliminar usuario
@auth_api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado"}), 200
