# Task Manager Application

A full-stack, containerised task management application built following DevOps best practices for IIB32303 – DevOps Essential.

Users can create, view, update, and delete tasks with dynamic status states: **Pending**, **In Progress**, and **Completed**. The entire system is containerised using Docker and orchestrated with Docker Compose.

---

## Architecture

This project follows a **Three-Tier Architecture**, fully isolated within a custom Docker bridge network:

```
[ Browser ]
     |
     ▼
[ Frontend – Nginx :80 ]
     |
     ▼
[ Backend – Flask REST API :5000 ]
     |
     ▼
[ Database – PostgreSQL :5432 ]
```

| Tier | Technology | Description |
|------|-----------|-------------|
| Presentation | Nginx (alpine) | Serves static frontend files (HTML, CSS, JS) |
| Logic | Flask + Python 3.11 | RESTful API handling CRUD operations at `/api/tasks` |
| Data | PostgreSQL 15 | Persistent relational database with Docker Volume |

---

## Prerequisites

Make sure the following are installed on your machine before running the project:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (tested on v29.1.3)
- Docker Compose (tested on v1.29.2 / v5.1.0)
- Git

Verify your installations:

```bash
docker --version
docker compose version
```

---

## Project Structure

```
task-manager/
├── backend/
│   ├── app.py                  # Flask REST API
│   ├── Dockerfile              # Backend container specification
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── index.html              # Main UI page
│   ├── style.css               # Stylesheet
│   ├── app.js                  # Frontend logic
│   └── Dockerfile              # Frontend container specification
├── docker-compose.yml          # Multi-container orchestration
└── deploy.sh                   # Automated deployment script
```

---

## Getting Started

### Option 1 – Automated Deployment (Recommended)

Run the provided shell script from the project root directory:

```bash
bash deploy.sh
```

This script will automatically:
1. Stop and remove any existing containers (`docker compose down`)
2. Rebuild all images with the latest changes (`docker compose up --build -d`)
3. Start all three services: PostgreSQL, Flask backend, and Nginx frontend
4. Display a confirmation message once deployment is complete

### Option 2 – Manual Deployment

```bash
# Clone the repository
git clone https://github.com/sharifhqistina/task-manager-backend.git
cd task-manager-backend

# Build and start all containers in detached mode
docker compose up --build -d

# Verify all containers are running
docker compose ps
```

---

## Accessing the Application

Once deployed, access the application at:

| Service | URL |
|---------|-----|
| Frontend UI | http://localhost |
| Backend API | http://localhost:5000/api/tasks |

---

## API Endpoints

All endpoints are available under `/api/tasks`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Retrieve all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/<id>` | Update an existing task (e.g. change status) |
| `DELETE` | `/api/tasks/<id>` | Delete a task |

### Task Status Values

- `Pending`
- `In Progress`
- `Completed`

---

## Environment Variables

The backend connects to the database using environment variables defined in `docker-compose.yml`. Credentials are never hardcoded into the codebase.

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | PostgreSQL database name |
| `DATABASE_URL` | Full connection string for Flask |

---

## Stopping the Application

```bash
docker compose down
```

To also remove the persistent database volume:

```bash
docker compose down -v
```

---

## Testing & Validation

After deployment, the following manual tests were conducted to verify the system:

- **Connectivity Test** – A new task was created via the UI and confirmed to appear in the "Pending" column, validating the POST request through the Flask API.
- **Database Update Test** – A task status was changed via the dropdown, confirming the PUT request successfully updated the PostgreSQL record.
- **Volume Persistence Test** – After reloading the browser, tasks retained their status, confirming Docker Volumes maintain data between sessions.

---

## Contributors

| Name | Student ID |
|------|-----------|
| Sharifah Nur Qistina Nabila Binti Syed Abd Rani | 52224123537 |
| Nur Huda Batrisyia Binti Harmizi | 52224123502 |
| Solihah Nafisatul 'Ilmi Binti Muhammad Nazri | 52224123588 |

**Course:** IIB32303 – DevOps Essential  
**Lecturer:** Ts. Fuead Ali  
**Programme:** Bachelor in Information Technology (Honours)(Internet of Things)
