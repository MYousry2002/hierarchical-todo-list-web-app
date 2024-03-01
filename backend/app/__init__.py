from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate


db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'myousry2002'
    app.config['CORS_HEADERS'] = 'Content-Type'

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)  # Initializes JWTManager to handle JWT operations

    # Ensure the imported blueprints match the variable names in their files
    from .routes.auth_routes import auth_bp
    from .routes.task_routes import task_bp
    from .routes.list_routes import list_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(task_bp, url_prefix='/taskscontainer')
    app.register_blueprint(list_bp, url_prefix='/listscontainer')

    return app
