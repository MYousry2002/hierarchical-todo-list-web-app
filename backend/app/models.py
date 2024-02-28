from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    lists = db.relationship(
        'List', backref='user', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return '<User %r>' % self.username


class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tasks = db.relationship(
        'Task', backref='list', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return '<List %r>' % self.title


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
    subtasks = db.relationship('Task',
                               backref=db.backref('parent', remote_side=[id]),
                               lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return '<Task %r>' % self.title
