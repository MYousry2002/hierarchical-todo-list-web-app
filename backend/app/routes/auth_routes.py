# Import necessary modules
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from .. import db
from ..models import User

# Create a new Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)


# Define route for user registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400

    # Hash the password and create a new user
    hashed_password = generate_password_hash(data['password'],
                                             method='pbkdf2:sha256')
    new_user = User(username=data['username'], password_hash=hashed_password)

    # Add the new user to the database session and commit the session
    db.session.add(new_user)
    db.session.commit()
    # Return a success message
    return jsonify({"message": "Registered successfully"}), 201


# Define route for user login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    # Check if user exists and password is correct
    if user and check_password_hash(user.password_hash, data['password']):
        # Use user ID as identity and create an access token
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        # Return an error message if username or password is invalid
        return jsonify({"message": "Invalid username or password"}), 401
