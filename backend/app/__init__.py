# Import necessary modules from flask and flask extensions
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Initialize SQLAlchemy and Migrate instances
db = SQLAlchemy()
migrate = Migrate()


# Function to create a new Flask application
def create_app():
    # Create a new Flask instance
    app = Flask(__name__)

    # Configure the Flask application
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'myousry2002'

    # Initialize SQLAlchemy and Migrate with the Flask app
    db.init_app(app)
    migrate.init_app(app, db)

    # Initializes JWTManager to handle JWT operations
    JWTManager(app)

    # Import the blueprints from the routes modules
    from .routes.auth_routes import auth_bp
    from .routes.task_routes import task_bp
    from .routes.list_routes import list_bp

    # Register the blueprints with the Flask app and set their URL prefixes
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(task_bp, url_prefix='/taskscontainer')
    app.register_blueprint(list_bp, url_prefix='/listscontainer')

    # Return the configured Flask app
    return app
