import { CONSTANTS } from '../constants/appConstants.js';
import { resetAudio } from '../utils/audioUtils.js';

export class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tasksContainer = document.getElementById('tasksContainer');
        this.taskCompleteSound = document.getElementById('taskCompleteSound');
        
        // Elementos de estadísticas
        this.totalTasksElement = document.getElementById('totalTasks');
        this.completedTasksElement = document.getElementById('completedTasks');
        this.pendingTasksElement = document.getElementById('pendingTasks');
        this.progressBarElement = document.getElementById('progressBar');
        this.progressPercentageElement = document.getElementById('progressPercentage');
        
        this.init();
    }

    init() {
        this.loadTasks();
        this.updateStats();
    }

    getPriorityWeight(priority) {
        const weights = {
            'alta': 3,    // Prioridad más alta (rojo) - mayor peso = más arriba
            'normal': 2,  // Prioridad media (amarillo)
            'baja': 1,    // Prioridad baja (azul)
            'none': 0     // Sin prioridad (blanco)
        };
        return weights[priority] || 0;
    }

    sortTasks() {
        // Primero, separamos las tareas completadas y no completadas
        const uncompletedTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);

        // Ordenamos las tareas no completadas por prioridad (mayor peso arriba)
        uncompletedTasks.sort((a, b) => {
            const weightA = this.getPriorityWeight(a.priority);
            const weightB = this.getPriorityWeight(b.priority);
            return weightB - weightA; // Cambiado el orden para que mayor peso vaya arriba
        });

        // Ordenamos las tareas completadas por prioridad
        completedTasks.sort((a, b) => {
            const weightA = this.getPriorityWeight(a.priority);
            const weightB = this.getPriorityWeight(b.priority);
            return weightB - weightA; // Cambiado el orden para que mayor peso vaya arriba
        });

        // Combinamos las tareas: primero las no completadas, luego las completadas
        this.tasks = [...uncompletedTasks, ...completedTasks];
    }

    createTaskElement(text, priority = 'normal', completed = false) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.classList.add(`task--${priority}`);
        if (completed) {
            task.classList.add('task--completed');
        }

        const taskContent = document.createElement('div');
        taskContent.classList.add('task__content');
        
        const taskText = document.createElement('p');
        taskText.classList.add('task__text');
        taskText.textContent = text;
        taskText.contentEditable = true;
        
        // Contenedor de prioridad
        const priorityContainer = document.createElement('div');
        priorityContainer.classList.add('task__priority-container');
        
        // Botón de prioridad actual
        const taskPriority = document.createElement('button');
        taskPriority.classList.add('task__priority');
        taskPriority.textContent = this.getPriorityText(priority);
        
        // Menú desplegable de prioridades
        const priorityMenu = document.createElement('div');
        priorityMenu.classList.add('task__priority-menu');
        
        const priorities = [
            { value: 'alta', text: '⚡ Alta', color: 'var(--color-danger)' },
            { value: 'normal', text: '📝 Normal', color: 'var(--color-warning)' },
            { value: 'baja', text: '🌟 Baja', color: 'var(--color-primary)' }
        ];
        
        priorities.forEach(p => {
            const option = document.createElement('button');
            option.classList.add('task__priority-option');
            option.textContent = p.text;
            option.style.color = p.color;
            option.dataset.priority = p.value;
            priorityMenu.appendChild(option);
        });
        
        priorityContainer.appendChild(taskPriority);
        priorityContainer.appendChild(priorityMenu);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('task__actions');
        
        // Botón Completar
        const completeButton = document.createElement('button');
        completeButton.classList.add('button', 'button--success');
        completeButton.innerHTML = '✓';
        completeButton.title = 'Completar tarea';
        
        // Botón Editar
        const editButton = document.createElement('button');
        editButton.classList.add('button', 'button--primary');
        editButton.textContent = 'Editar';
        
        // Botón Guardar (inicialmente oculto)
        const saveEditButton = document.createElement('button');
        saveEditButton.classList.add('button', 'button--primary');
        saveEditButton.textContent = 'Guardar';
        saveEditButton.style.display = 'none';
        
        // Botón Eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('button', 'button--danger');
        deleteButton.textContent = 'Eliminar';

        taskContent.appendChild(taskText);
        taskContent.appendChild(priorityContainer);
        optionsContainer.appendChild(completeButton);
        optionsContainer.appendChild(editButton);
        optionsContainer.appendChild(saveEditButton);
        optionsContainer.appendChild(deleteButton);
        task.appendChild(taskContent);
        task.appendChild(optionsContainer);

        this.setupTaskEvents(task, taskText, taskPriority, priorityMenu, completeButton, editButton, saveEditButton, deleteButton);

        return task;
    }

    getPriorityText(priority) {
        const priorities = {
            'alta': '⚡ Alta',
            'normal': '📝 Normal',
            'baja': '🌟 Baja'
        };
        return priorities[priority] || priorities['normal'];
    }

    addTask(text, priority = 'normal') {
        if (text.trim() === '') return;
        
        const taskData = { text, priority, completed: false };
        this.tasks.push(taskData);
        
        // Ordenar tareas y actualizar la vista
        this.sortTasks();
        this.loadTasks();
        this.saveTasks();
        this.updateStats();
        this.playAddSound();
    }

    setupTaskEvents(taskElement, taskText, taskPriority, priorityMenu, completeButton, editButton, saveEditButton, deleteButton) {
        // Evento para mostrar/ocultar menú de prioridades
        taskPriority.addEventListener('click', (e) => {
            e.stopPropagation();
            // Cerrar todos los otros menús de prioridad primero
            document.querySelectorAll('.task__priority-menu.show').forEach(menu => {
                if (menu !== priorityMenu) {
                    menu.classList.remove('show');
                }
            });
            // Alternar el menú actual
            priorityMenu.classList.toggle('show');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!taskPriority.contains(e.target) && !priorityMenu.contains(e.target)) {
                priorityMenu.classList.remove('show');
            }
        });

        // Eventos para opciones de prioridad
        priorityMenu.querySelectorAll('.task__priority-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const newPriority = option.dataset.priority;
                const index = Array.from(this.tasksContainer.children).indexOf(taskElement);
                
                // Actualizar prioridad en el objeto y UI
                this.tasks[index].priority = newPriority;
                
                // Reordenar y actualizar la vista
                this.sortTasks();
                this.loadTasks();
                this.saveTasks();
                
                // Ocultar menú
                priorityMenu.classList.remove('show');
            });
        });

        // Evento para completar tarea
        completeButton.addEventListener('click', () => {
            const index = Array.from(this.tasksContainer.children).indexOf(taskElement);
            this.tasks[index].completed = !this.tasks[index].completed;
            
            // Reordenar después de completar
            this.sortTasks();
            this.loadTasks();
            this.saveTasks();
            this.updateStats();
            this.playAddSound();
        });

        // Evento para activar edición
        editButton.addEventListener('click', () => {
            taskText.contentEditable = true;
            taskElement.classList.add('task--editing');
            taskText.focus();
            editButton.style.display = 'none';
            saveEditButton.style.display = 'block';
        });

        // Evento para guardar edición
        saveEditButton.addEventListener('click', () => {
            const index = Array.from(this.tasksContainer.children).indexOf(taskElement);
            this.tasks[index].text = taskText.textContent;
            taskText.contentEditable = false;
            taskElement.classList.remove('task--editing');
            saveEditButton.style.display = 'none';
            editButton.style.display = 'block';
            this.saveTasks();
        });

        // Evento para detectar Enter al editar
        taskText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEditButton.click();
            }
        });

        // Evento para detectar cuando se pierde el foco
        taskText.addEventListener('blur', (e) => {
            // Si no se hizo clic en el botón guardar, guardamos automáticamente
            if (saveEditButton.style.display === 'block') {
                saveEditButton.click();
            }
        });

        // Evento para eliminar tarea
        deleteButton.addEventListener('click', () => {
            const index = Array.from(this.tasksContainer.children).indexOf(taskElement);
            this.tasks.splice(index, 1);
            this.sortTasks();
            this.loadTasks();
            this.saveTasks();
            this.updateStats();
        });
    }

    loadTasks() {
        this.tasksContainer.innerHTML = '';
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task.text, task.priority, task.completed);
            this.tasksContainer.appendChild(taskElement);
        });
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        this.totalTasksElement.textContent = totalTasks;
        this.completedTasksElement.textContent = completedTasks;
        this.pendingTasksElement.textContent = pendingTasks;
        this.progressBarElement.style.width = `${completionPercentage}%`;
        this.progressPercentageElement.textContent = `${completionPercentage}% Completado`;
    }

    playAddSound() {
        if (this.taskCompleteSound) {
            this.taskCompleteSound.currentTime = 0;
            this.taskCompleteSound.play().catch(() => {});
        }
    }
} 