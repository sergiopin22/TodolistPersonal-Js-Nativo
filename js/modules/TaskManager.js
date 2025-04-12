import { CONSTANTS } from '../constants/appConstants.js';
import { resetAudio } from '../utils/audioUtils.js';

export class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskContainer = document.createElement('div');
        this.taskContainer.className = 'tasks-container';
        this.input = document.querySelector(".input");
        this.taskCompleteSound = new Audio('8-bit-powerup-6768.mp3');
        this.statsContainer = document.createElement('div');
        this.statsContainer.className = 'stats-container';
        this.init();
        this.renderSavedTasks();
        this.updateStats();
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updateStats();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        this.statsContainer.innerHTML = `
            <div class="stats-item">
                <span class="stats-number">${total}</span>
                <span class="stats-label">Total</span>
            </div>
            <div class="stats-item">
                <span class="stats-number">${completed}</span>
                <span class="stats-label">Completadas</span>
            </div>
            <div class="stats-item">
                <span class="stats-number">${pending}</span>
                <span class="stats-label">Pendientes</span>
            </div>
            <div class="stats-item">
                <div class="completion-bar">
                    <div class="completion-progress" style="width: ${completionRate}%"></div>
                </div>
                <span class="stats-label">${completionRate}% Completado</span>
            </div>
        `;
    }

    renderSavedTasks() {
        // Insertar el contenedor de estadísticas antes del contenedor de tareas
        const inputContainer = document.querySelector('.input-container');
        inputContainer.parentNode.insertBefore(this.statsContainer, inputContainer.nextSibling);
        
        // Insertar el contenedor de tareas después de las estadísticas
        inputContainer.parentNode.insertBefore(this.taskContainer, this.statsContainer.nextSibling);

        // Renderizar tareas en orden inverso
        for (let i = this.tasks.length - 1; i >= 0; i--) {
            const taskElements = this.createTaskElement(this.tasks[i], i);
            this.setupTaskEvents(taskElements, i);
            this.taskContainer.appendChild(taskElements.taskContainer);
        }
    }

    createTaskElement(task, taskId) {
        const taskContainer = document.createElement("div");
        const titleTask = document.createElement("h2");
        const optionsContainer = document.createElement("div");
        const editButton = document.createElement("button");
        const completeEditButton = document.createElement("button");
        const completeButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        taskContainer.classList.add("containt-task");
        if (task.completed) {
            taskContainer.classList.add("completed-task");
        }
        optionsContainer.classList.add("options");
        editButton.classList.add(`edite${taskId}`, "edite-task");
        completeEditButton.classList.add(`complete${taskId}`, "complete-edite-task");
        completeButton.classList.add("complete-task");
        deleteButton.classList.add(`delete${taskId}`, "delete-task");

        editButton.textContent = `Editar${CONSTANTS.ICONS.EDIT}`;
        completeEditButton.textContent = "Editado";
        completeButton.innerHTML = task.completed ? "↩️" : "✓";
        completeButton.title = task.completed ? "Marcar como pendiente" : "Marcar como completada";
        deleteButton.textContent = CONSTANTS.ICONS.DELETE;
        titleTask.textContent = task.text;

        deleteButton.dataset.delete = taskId;
        editButton.dataset.edite = taskId;
        taskContainer.dataset.contain = taskId;

        taskContainer.appendChild(titleTask);
        taskContainer.appendChild(optionsContainer);
        optionsContainer.appendChild(completeButton);
        optionsContainer.appendChild(editButton);
        optionsContainer.appendChild(completeEditButton);
        optionsContainer.appendChild(deleteButton);

        return { taskContainer, titleTask, editButton, completeEditButton, completeButton, deleteButton };
    }

    setupTaskEvents(taskElements, taskId) {
        const { taskContainer, titleTask, editButton, completeEditButton, completeButton, deleteButton } = taskElements;

        deleteButton.addEventListener("click", () => {
            this.tasks.splice(taskId, 1);
            this.saveTasks();
            taskContainer.remove();
            resetAudio(this.taskCompleteSound);
            this.updateTaskIds();
        });

        completeButton.addEventListener("click", () => {
            this.tasks[taskId].completed = !this.tasks[taskId].completed;
            taskContainer.classList.toggle("completed-task");
            completeButton.innerHTML = this.tasks[taskId].completed ? "↩️" : "✓";
            completeButton.title = this.tasks[taskId].completed ? "Marcar como pendiente" : "Marcar como completada";
            resetAudio(this.taskCompleteSound);
            this.saveTasks();
        });

        editButton.addEventListener("click", () => {
            if (!this.tasks[taskId].completed) {
                titleTask.setAttribute("contenteditable", "true");
                titleTask.classList.add("editarTitle");
                deleteButton.disabled = true;
                editButton.disabled = true;
                completeButton.disabled = true;
                completeEditButton.style.display = "inline";
            }
        });

        completeEditButton.addEventListener("click", () => {
            if (this.validateTaskContent(titleTask)) {
                titleTask.setAttribute("contenteditable", "false");
                titleTask.classList.remove("editarTitle");
                deleteButton.disabled = false;
                editButton.disabled = false;
                completeButton.disabled = false;
                completeEditButton.style.display = "none";
                this.tasks[taskId].text = titleTask.textContent;
                this.saveTasks();
            }
        });
    }

    updateTaskIds() {
        const taskElements = this.taskContainer.querySelectorAll('.containt-task');
        taskElements.forEach((task, index) => {
            task.dataset.contain = index;
            const editBtn = task.querySelector('.edite-task');
            const completeBtn = task.querySelector('.complete-edite-task');
            const deleteBtn = task.querySelector('.delete-task');
            
            editBtn.className = `edite${index} edite-task`;
            completeBtn.className = `complete${index} complete-edite-task`;
            deleteBtn.className = `delete${index} delete-task`;
            deleteBtn.dataset.delete = index;
            editBtn.dataset.edite = index;
        });
    }

    validateTaskContent(titleElement) {
        const content = titleElement.textContent.trim();
        if (content.length === 0 || content.length > CONSTANTS.MAX_TASK_LENGTH) {
            titleElement.closest('.containt-task').remove();
            return false;
        }
        return true;
    }

    addTask(taskText) {
        if (taskText.trim() === "") {
            alert("NO SE PUEDEN MANDAR TAREAS VACIAS");
            return;
        }
        if (taskText.length > CONSTANTS.MAX_TASK_LENGTH) {
            alert("Tareas máximo con 30 caracteres. No se pueden crear tareas más largas.");
            return;
        }

        // Crear objeto de tarea con estado de completado
        const newTask = {
            text: taskText,
            completed: false
        };

        // Agregar la nueva tarea al principio del array
        this.tasks.unshift(newTask);
        this.saveTasks();

        // Crear y configurar el elemento de la nueva tarea
        const taskElements = this.createTaskElement(newTask, 0);
        this.setupTaskEvents(taskElements, 0);

        // Insertar la nueva tarea al principio del contenedor
        if (this.taskContainer.firstChild) {
            this.taskContainer.insertBefore(taskElements.taskContainer, this.taskContainer.firstChild);
        } else {
            this.taskContainer.appendChild(taskElements.taskContainer);
        }

        // Actualizar los IDs de todas las tareas
        this.updateTaskIds();
    }

    init() {
        document.addEventListener("keydown", (event) => {
            if (event.target.matches(".input") && event.key === "Enter") {
                this.addTask(event.target.value);
                event.target.value = "";
            }
        });
    }
} 