# Import necessary modules
from datetime import datetime
from . import db


# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    # Relationship with List model
    lists = db.relationship(
        'List', backref='user', lazy=True, cascade="all, delete-orphan")

    # String representation of the User model
    def __repr__(self):
        return '<User %r>' % self.username


# Define List model
class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # Relationship with Task model
    tasks = db.relationship(
        'Task', backref='list', lazy=True, cascade="all, delete-orphan")

    # String representation of the List model
    def __repr__(self):
        return '<List %r>' % self.title

    # Convert List model to dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            # Add other fields if necessary
        }


# Define Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    completed = db.Column(db.Boolean, default=False, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=True)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime,
                           default=datetime.utcnow, onupdate=datetime.utcnow)
    # Relationship with itself to handle subtasks
    subtasks = db.relationship('Task',
                               backref=db.backref('parent', remote_side=[id]),
                               lazy=True, cascade="all, delete-orphan")

    # String representation of the Task model
    def __repr__(self):
        return '<Task %r>' % self.title

    # Convert Task model to dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "parent_id": self.parent_id,
            "list_id": self.list_id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "subtasks": [subtask.to_dict() for subtask in self.subtasks]
            if self.subtasks else []
        }
