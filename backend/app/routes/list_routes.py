# Import necessary modules
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models import List

# Create a new Blueprint for list routes
list_bp = Blueprint('listscontainer', __name__)


# Define route for getting all lists of the current user
@list_bp.route('/lists', methods=['GET'])
@jwt_required()  # Require JWT token for this route
def get_lists():
    # Get the identity of the current user
    current_user_id = get_jwt_identity()
    lists = List.query.filter_by(user_id=current_user_id).all()
    # Prepare the data to be returned
    lists_data = [{
        "id": lst.id,
        "title": lst.title,
        "description": lst.description,
        "user_id": lst.user_id
    } for lst in lists]
    return jsonify(lists_data), 200  # Return the data as JSON


# Define route for adding a new list
@list_bp.route('/lists', methods=['POST'])
@jwt_required()
def add_list():  # Require JWT token for this route
    current_user_id = get_jwt_identity()
    data = request.get_json()  # Get the data from the request

    # Check if the title is provided
    if 'title' not in data:
        return jsonify({"message": "Missing required title field"}), 400

    # Create a new list
    new_list = List(title=data['title'],
                    description=data.get('description', ''),
                    user_id=current_user_id)
    db.session.add(new_list)  # Add the new list to the session
    db.session.commit()  # Commit the session
    return jsonify({"message": "List added", "list_id": new_list.id}), 201


# Define route for getting a specific list
@list_bp.route('/lists/<int:list_id>', methods=['GET'])
@jwt_required()  # Require JWT token for this route
def get_list(list_id):
    current_user_id = get_jwt_identity()
    # Get the list or return 404 if not found
    lst = List.query.get_or_404(list_id)
    # Check if the current user is the owner of the list
    if lst.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to access this list"}), 403

    # Return the list data as JSON
    return jsonify({
        "id": lst.id,
        "title": lst.title,
        "description": lst.description,
        "user_id": lst.user_id
    }), 200


# Define route for updating a specific list
@list_bp.route('/lists/<int:list_id>', methods=['PUT'])
@jwt_required()  # Require JWT token for this route
def update_list(list_id):
    # Get the identity of the current user
    current_user_id = get_jwt_identity()
    # Get the list or return 404 if not found
    lst = List.query.get_or_404(list_id)
    data = request.get_json()  # Get the data from the request

    # Check if the current user is the owner of the list
    if lst.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to update this list"}), 403

    # Update the list
    lst.title = data.get('title', lst.title)
    # Update description
    lst.description = data.get('description', lst.description)
    db.session.commit()  # Commit the session

    # Return the updated list data as JSON
    return jsonify({
        "id": lst.id,
        "title": lst.title,
        "description": lst.description,  # Include description
        "user_id": lst.user_id
    }), 200


# Define route for deleting a specific list
@list_bp.route('/lists/<int:list_id>', methods=['DELETE'])
@jwt_required()  # Require JWT token for this route
def delete_list(list_id):
    current_user_id = get_jwt_identity()
    lst = List.query.get_or_404(list_id)

    # Check if the current user is the owner of the list
    if lst.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to delete this list"}), 403

    db.session.delete(lst)  # Delete the list from the session
    db.session.commit()  # Commit the session
    return jsonify({"message": "List deleted"}), 200
