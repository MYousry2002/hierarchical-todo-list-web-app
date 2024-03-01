from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models import Task

task_bp = Blueprint('tasks', __name__)


@task_bp.route('/tasks', methods=['POST'])
@jwt_required()
def add_task():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if 'title' not in data or 'list_id' not in data:
        return jsonify({"message": "Missing required data"}), 400
    new_task = Task(title=data['title'],
                    user_id=current_user_id, list_id=data['list_id'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task added", "task_id": new_task.id}), 201


@task_bp.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(
        id=task_id, user_id=current_user_id).first_or_404()
    return jsonify(task.to_dict()), 200


@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(
        id=task_id, user_id=current_user_id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200


@task_bp.route('/tasks/<int:task_id>', methods=['PATCH'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(
        id=task_id, user_id=current_user_id).first_or_404()
    data = request.get_json()
    if 'completed' in data:
        task.completed = data['completed']
    db.session.commit()
    return jsonify({"message": "Task updated"}), 200


@task_bp.route('/tasks/<int:list_id>', methods=['GET'])
@jwt_required()
def get_tasks_by_list(list_id):
    current_user_id = get_jwt_identity()
    tasks = Task.query.filter_by(
        list_id=list_id, user_id=current_user_id).all()
    return jsonify([task.to_dict() for task in tasks]), 200
