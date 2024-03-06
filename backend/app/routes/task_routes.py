# Import necessary modules from flask and flask_jwt_extended
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
# Import the database instance and the Task model from the parent package
from .. import db
from ..models import Task

# Create a Blueprint for task-related routes
task_bp = Blueprint('tasks', __name__)


# Define a route for adding a new task, accessible via POST requests
@task_bp.route('/tasks', methods=['POST'])
@jwt_required()  # Require the user to be logged in
def add_task():
    # Get the ID of the currently logged in user
    current_user_id = get_jwt_identity()
    # Get the JSON data from the request
    data = request.get_json()
    # If the required fields 'title' and 'list_id' are not in the data
    # return an error
    if 'title' not in data or 'list_id' not in data:
        return jsonify({"message": "Missing required data"}), 400

    # If 'parent_id' is not provided, it means the task is not a subtask
    parent_id = data.get('parent_id')
    # Create a new Task instance with the provided data
    new_task = Task(title=data['title'],
                    description=data.get('description', ''),
                    user_id=current_user_id,
                    list_id=data['list_id'],
                    parent_id=parent_id)
    # Add the new task to the session and commit the session to the database
    db.session.add(new_task)
    db.session.commit()
    # Return a success message along with the ID of the new task
    return jsonify({"message": "Task added", "task_id": new_task.id}), 201


# Define a route for getting a specific task, accessible via GET requests
@task_bp.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()  # Require the user to be logged in
def get_task(task_id):
    # Get the ID of the currently logged in user
    current_user_id = get_jwt_identity()
    # Query the database for the task with the provided ID
    # and the current user's ID
    task = Task.query.filter_by(
        id=task_id, user_id=current_user_id).first_or_404()
    # Return the task as a JSON object
    return jsonify(task.to_dict()), 200


# Define a route for getting all tasks in a specific list,
# accessible via GET requests
@task_bp.route('/tasks/by_list/<int:list_id>', methods=['GET'])
@jwt_required()  # Require the user to be logged in
def get_tasks_by_list(list_id):
    # Get the ID of the currently logged in user
    current_user_id = get_jwt_identity()
    # Query the database for all tasks in the provided list
    # that belong to the current user
    tasks = Task.query.filter_by(list_id=list_id,
                                 user_id=current_user_id,
                                 parent_id=None).all()
    # Return the tasks as a JSON array
    return jsonify([task.to_dict() for task in tasks]), 200


# Define a route for getting all subtasks of a specific task,
# accessible via GET requests
@task_bp.route('/subtasks/<int:task_id>', methods=['GET'])
@jwt_required()  # Require the user to be logged in
def get_subtasks(task_id):
    # Get the ID of the currently logged in user
    current_user_id = get_jwt_identity()
    # Query the database for all tasks that have the
    # provided task as their parent
    subtasks = Task.query.filter_by(
        parent_id=task_id, user_id=current_user_id).all()
    # Return the subtasks as a JSON array
    return jsonify([subtask.to_dict() for subtask in subtasks]), 200


# Define a route for deleting a specific task, accessible via DELETE requests
@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()  # Require the user to be logged in
def delete_task(task_id):
    # Get the ID of the currently logged in user
    current_user_id = get_jwt_identity()
    # Query the database for the task with the provided ID
    # and the current user's ID
    task = Task.query.filter_by(
        id=task_id, user_id=current_user_id).first_or_404()
    # Delete the task from the session and commit the session to the database
    db.session.delete(task)
    db.session.commit()
    # Return a success message
    return jsonify({"message": "Task deleted"}), 200


# Define a route for updating a specific task,
# accessible via PATCH and PUT requests
@task_bp.route('/tasks/<int:task_id>', methods=['PATCH', 'PUT'])
@jwt_required()  # Require the user to be logged in
def update_task(task_id):
    # Get the ID of the currently logged in user
    current_user_id = get_jwt_identity()
    # Query the database for the task with the provided ID
    # and the current user's ID
    task = Task.query.filter_by(
        id=task_id, user_id=current_user_id).first_or_404()

    # Get the JSON data from the request
    data = request.get_json()

    # If the 'title', 'description', or 'completed' fields
    # are in the data, update the task
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'completed' in data:
        task.completed = data['completed']

    # Commit the session to the database
    db.session.commit()
    # Return the updated task as a JSON object
    return jsonify(task.to_dict()), 200


# Define a route for moving a task to a different list,
# accessible via PATCH requests
@task_bp.route('/tasks/move/<int:task_id>', methods=['PATCH'])
@jwt_required()  # Require the user to be logged in
def move_task(task_id):
    # Get the ID of the currently logged in user
    current_user_id = get_jwt_identity()
    # Query the database for the task with the provided ID
    # and the current user's ID
    task = Task.query.filter_by(id=task_id,
                                user_id=current_user_id).first_or_404()
    # Get the JSON data from the request
    data = request.get_json()

    # If the 'list_id' field is in the data, update the task's list
    if 'list_id' in data:
        task.list_id = data['list_id']
        # Commit the session to the database
        db.session.commit()
        # Return a success message along with the moved task as a JSON object
        return jsonify({"message": "Task moved successfully",
                        "task": task.to_dict()}), 200

    # If the 'list_id' field is not in the data, return an error
    return jsonify({"message": "List ID not provided"}), 400
