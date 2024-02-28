from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
from ..models import Task

task_bp = Blueprint('tasks', __name__)


@task_bp.route('/task', methods=['POST'])
@jwt_required()
def add_task():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if 'title' not in data:
        return jsonify({"message": "Missing required title field"}), 400

    new_task = Task(title=data['title'], user_id=current_user_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task added", "task_id": new_task.id}), 201


@task_bp.route('/task/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.get_or_404(task_id)

    if task.user_id != current_user_id:
        return jsonify({"message": "Unauthorized to access this task"}), 403

    return jsonify({
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "user_id": task.user_id
    }), 200
