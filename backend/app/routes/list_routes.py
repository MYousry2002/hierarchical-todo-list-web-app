from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models import List

list_bp = Blueprint('listscontainer', __name__)


@list_bp.route('/lists', methods=['GET'])
@jwt_required()
def get_lists():
    current_user_id = get_jwt_identity()
    lists = List.query.filter_by(user_id=current_user_id).all()
    lists_data = [{
        "id": lst.id,
        "title": lst.title,
        "description": lst.description,  # Include description
        "user_id": lst.user_id
    } for lst in lists]
    return jsonify(lists_data), 200


@list_bp.route('/lists', methods=['POST'])
@jwt_required()
def add_list():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if 'title' not in data:
        return jsonify({"message": "Missing required title field"}), 400

    # Include the description in the new list creation
    new_list = List(title=data['title'],
                    description=data.get('description', ''),
                    user_id=current_user_id)
    db.session.add(new_list)
    db.session.commit()
    return jsonify({"message": "List added", "list_id": new_list.id}), 201


@list_bp.route('/lists/<int:list_id>', methods=['GET'])
@jwt_required()
def get_list(list_id):
    current_user_id = get_jwt_identity()
    lst = List.query.get_or_404(list_id)

    if lst.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to access this list"}), 403

    return jsonify({
        "id": lst.id,
        "title": lst.title,
        "description": lst.description,  # Include description
        "user_id": lst.user_id
    }), 200


@list_bp.route('/lists/<int:list_id>', methods=['PUT'])
@jwt_required()
def update_list(list_id):
    current_user_id = get_jwt_identity()
    lst = List.query.get_or_404(list_id)
    data = request.get_json()

    if lst.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to update this list"}), 403

    lst.title = data.get('title', lst.title)
    # Update description
    lst.description = data.get('description', lst.description)
    db.session.commit()
    return jsonify({
        "id": lst.id,
        "title": lst.title,
        "description": lst.description,  # Include description
        "user_id": lst.user_id
    }), 200


@list_bp.route('/lists/<int:list_id>', methods=['DELETE'])
@jwt_required()
def delete_list(list_id):
    current_user_id = get_jwt_identity()
    lst = List.query.get_or_404(list_id)

    if lst.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to delete this list"}), 403

    db.session.delete(lst)
    db.session.commit()
    return jsonify({"message": "List deleted"}), 200
