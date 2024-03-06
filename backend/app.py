# Import the create_app function from the app module
from app import create_app

# Call the create_app function to create a Flask application instance
app = create_app()

# If this script is run directly (instead of being imported),
# start the Flask development server
if __name__ == '__main__':
    # Run the application with debugging enabled
    app.run(debug=True)
