import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 1. DATABASE CONFIGURATION (Connects to Solihah's PostgreSQL container)
# It safely grabs credentials from environment variables set in docker-compose.yml
DB_USER = os.environ.get('POSTGRES_USER', 'postgres')
DB_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'password')
DB_HOST = os.environ.get('DB_HOST', 'db')  # This matches the database service name
DB_NAME = os.environ.get('POSTGRES_DB', 'task_db')

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 2. DEFINE THE DATABASE MODEL
class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default='Pending', nullable=False)

    def to_dict(self):
        return {"id": self.id, "title": self.title, "status": self.status}

# 3. API ENDPOINTS

# GET all tasks (with optional status filtering)
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    status_filter = request.args.get('status')
    if status_filter:
        all_tasks = Task.query.filter(Task.status.ilike(status_filter)).all()
    else:
        all_tasks = Task.query.all()
    return jsonify([task.to_dict() for task in all_tasks]), 200

# POST a new task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({"error": "You must provide a task title!"}), 400
    
    new_task = Task(title=data['title'], status='Pending')
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

# PUT to update task status or title
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found!"}), 404
        
    if 'status' in data:
        if data['status'] not in ['Pending', 'In Progress', 'Completed']:
            return jsonify({"error": "Invalid status value!"}), 400
        task.status = data['status']
    if 'title' in data:
        task.title = data['title']
        
    db.session.commit()
    return jsonify(task.to_dict()), 200

# DELETE a task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found!"}), 404
        
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": f"Task {task_id} has been deleted successfully"}), 200

# AUTOMATION HELPER: Creates database tables if they don't exist yet
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)