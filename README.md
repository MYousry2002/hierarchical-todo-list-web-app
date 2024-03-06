# Hierarchical To-Do List Web Application

A comprehensive web application designed to help users manage their tasks and projects in a hierarchical structure. This application allows for the creation of tasks within tasks and enables smooth transition accross them, offering a detailed view of the structure of the work that needs to be done.

## Features
- Multiple users with user authentication (register, login, logout).
- Create multiple lists and edit or remove them. 
- Reorder lists ondisplay using drag and drop.
- Create multiple tasks within a list.
- Create subtasks within a task with unlimited depth. 
- Edit or delete tasks or subtasks.
- Collapse and expand lists and tasks or subtasks.
- Mark tasks or subtasks as complete.
- Drag and Drop functionality for tasks between lists.
- Durable database to manage user data.

## Usage: 

Watch this demo [here](https://www.loom.com/share/aab7966035bb48818131c9662e0505e9?sid=37c303a7-c71d-4af6-ba0b-9150af6e2dcb) to get to know the app!


## Application Structure

### Backend
The backend is built with Flask. It is structured to provide API endpoints for user authentication and CRUD operations for lists and tasks. It uses sqlAlchemy for the database.

### Frontend
The frontend is created using React. It is composed of several components that work together to provide a seamless and dynamic user experience.

```graphql
hierarchical-todo-list-app/
│
|
├── backend/                          # All backend code
│   ├── app/                          # Flask application
│   │   ├── __init__.py               # Initializes Flask app and put together components
│   │   ├── models.py                 # Database models (Users, Lists, Tasks)
|   |   |
│   │   └── routes/                   # API routes
│   │       ├── auth_routes.py        # Authentication routes (register, login, logout)
|   |       ├── list_routes.py        # Authentication routes (register, login, logout)
│   │       └── task_routes.py        # Task management routes
│   │   
│   ├── tests/                        # Tests for the Flask app (to be implemented)
│   │   ├── __init__.py
│   │   ├── test_config.py
│   │   └── test_routes.py
|   |
│   ├── requirements.txt              # Python dependencies
│   ├── app.py                        # Entry point to run the Flask application
│   ├── migrations/                   # SQLAlchemy database migrations
│   ├── instance/                     # Instance of the database
│   └── venv/                         # Environment variables
│
|
|
├── frontend/                         # All frontend code
│   ├── public/                       # Static files
│   │   └── index.html                # Entry point HTML file
|   |
│   ├── src/                          # React source files
│   │   ├── components/               # React components
│   │   │   ├── App/                  # App component directory
│   │   │   │   ├── App.js            # Main app component
│   │   │   │   ├── App.test.js       # Test file for App component
│   │   │   │   └── App.css           # Styling for App component
|   |   |   ├── Auth/                 # Authentication components direc
│   │   │   |   ├── Register/         # Register component directory
│   │   │   │   |   ├── Register.js   # Component for rendering registration form
│   │   │   │   |   └── Register.css  # Styling for Register component
│   │   │   |   ├── Login/            # Login component directory
│   │   │   │   |   ├── Login.js      # Component for rendering login form
│   │   │   │   |   └── Login.css     # Styling for Login component
│   │   │   |   └── Logout/           # Logout component directory
│   │   │   │       ├── Logout.js     # Component for rendering logout button
│   │   │   │       └── Logout.css    # Styling for logout component
│   │   │   ├── ListContainer/        # List container component directory
│   │   │   │   ├── ListContainer.js  # Component for rendering all lists
│   │   │   │   └── ListContainer.css # Styling for list container component
│   │   │   ├── List/                 # List component directory
│   │   │   │   ├── List.js           # Component for rendering a list
│   │   │   │   └── List.css          # Styling for list component
│   │   │   ├── TaskContainer/        # Task container component directory
│   │   │   │   ├── TaskContainer.js  # Component for rendering all tasks or subtasks
│   │   │   │   └── TaskContainer.css # Styling for task container component
│   │   │   └── Task/                 # Task component directory
│   │   │       ├── Task.js           # Component for rendering a task or subtask
│   │   │       └── Task.css          # Styling for a task or subtask component
|   |   |
│   │   ├── services/                 # Services for API calls
│   │   │   └── api.js                # Axios instance for API calls
|   |   |
│   │   ├── index.css                 # Main CSS file
│   │   ├── index.js                  # Entry point for React app
│   │   ├── reportWebVitals.js        # Performance measuring
│   │   └── setupTests.js             # Setup tests for the react app
|   |
│   └── package.json                  # NPM dependencies and scripts
│
|
├── .gitignore                      # Files and folders to be ignored by Git
└── README.md                       # General project documentation

```

## Installation

1. Clone the repository

```bash
git clone https://github.com/MYousry2002/hierarchical-todo-list-web-app.git
```

2. Navigate to the backend directory, install dependencies, and start the server

On Windows:
```bash
cd backend
python3 -m venv venv
venv\Scripts\activate.bat
pip3 install -r requirements.txt
python3 app.py
```

On macOS:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 app.py
```

3. In a new terminal, navigate to the frontend directory, install dependencies, and start the React application:
```bash
cd frontend
npm install
npm start
```

4. Open http://localhost:3000 in your browser to view the application.


## Contribution
Contributions are welcome. Please fork the repository and submit a pull request with your proposed changes.

