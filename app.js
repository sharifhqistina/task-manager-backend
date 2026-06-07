const API_URL = 'http://localhost:5000/api/tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const pendingList = document.getElementById('pending-list');
const inProgressList = document.getElementById('in-progress-list');
const completedList = document.getElementById('completed-list');

// 1. LOAD TASKS WHEN THE PAGE OPENS
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        
        // Clear the current lists so we don't duplicate
        pendingList.innerHTML = '';
        inProgressList.innerHTML = '';
        completedList.innerHTML = '';

        // Put each task from the database onto the board
        tasks.forEach(task => addTaskToBoard(task));
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// 2. ADD A NEW TASK TO THE DATABASE
taskForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const taskTitle = taskInput.value.trim();
    
    if (taskTitle !== '') {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: taskTitle })
            });

            if (response.ok) {
                const newTask = await response.json();
                addTaskToBoard(newTask); // Add the returned task to the screen
                taskInput.value = '';    // Clear the input box
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
});

// Function to create the HTML for a task and put it in the right column
function addTaskToBoard(task) {
    const li = document.createElement('li');
    li.style.backgroundColor = '#fff';
    li.style.padding = '10px';
    li.style.margin = '10px 0';
    li.style.borderRadius = '4px';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    
    const span = document.createElement('span');
    span.textContent = task.title;
    li.appendChild(span);

    const select = document.createElement('select');
    select.innerHTML = `
        <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
    `;
    select.style.padding = '5px';
    select.style.border = '1px solid #ccc';
    select.style.borderRadius = '4px';

    // 3. UPDATE TASK STATUS IN THE DATABASE WHEN DROPDOWN CHANGES
    select.addEventListener('change', async function() {
        const newStatus = select.value;
        try {
            // Send the updated status to the API using the task's unique ID
            await fetch(`${API_URL}/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            // Move the task visually once the database is updated
            moveTask(li, newStatus);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    });

    li.appendChild(select);
    moveTask(li, task.status);
}

// Function to move the task visually based on status
function moveTask(taskElement, status) {
    if (status === 'Pending') {
        pendingList.appendChild(taskElement);
        taskElement.style.borderLeft = '4px solid #ffd1dc'; // Pink
    } else if (status === 'In Progress') {
        inProgressList.appendChild(taskElement);
        taskElement.style.borderLeft = '4px solid #fdfd96'; // Yellow
    } else if (status === 'Completed') {
        completedList.appendChild(taskElement);
        taskElement.style.borderLeft = '4px solid #77dd77'; // Green
    }
}

fetchTasks();
