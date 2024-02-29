from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate


db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'myousry2002'

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)  # Initializes JWTManager to handle JWT operations

    # Initialize CORS
    CORS(app, resources={r"/auth/*": {"origins": "*"}},
         supports_credentials=True, allow_headers=[
             'Content-Type', 'Authorization', 'X-Requested-With'
    ])

    # Ensure the imported blueprints match the variable names in their files
    from .routes.auth_routes import auth_bp
    from .routes.task_routes import task_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(task_bp, url_prefix='/task')

    return app
