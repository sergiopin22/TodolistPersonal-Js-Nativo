import { ThemeManager } from './modules/ThemeManager.js';
import { TaskManager } from './modules/TaskManager.js';
import { ModalManager } from './modules/ModalManager.js';
import { TaskModal } from './modules/TaskModal.js';

class App {
    constructor() {
        this.taskManager = new TaskManager();
        this.themeManager = new ThemeManager();
        
        // Elementos del modal de nueva tarea
        this.newTaskModal = document.getElementById('newTaskModal');
        this.newTaskForm = document.getElementById('newTaskForm');
        this.taskTitle = document.getElementById('taskTitle');
        this.priorityButton = document.getElementById('priorityButton');
        this.priorityDropdown = document.getElementById('priorityDropdown');
        this.addTaskButton = document.getElementById('addTaskButton');
        this.closeNewTaskModal = document.getElementById('closeNewTaskModal');
        this.cancelNewTask = document.getElementById('cancelNewTask');
        this.currentPriority = 'normal';
        
        this.init();
    }

    init() {
        // Evento para abrir el modal de nueva tarea
        this.addTaskButton.addEventListener('click', () => {
            this.newTaskModal.classList.add('show');
            this.taskTitle.focus();
        });

        // Eventos para cerrar el modal
        this.closeNewTaskModal.addEventListener('click', () => {
            this.newTaskModal.classList.remove('show');
            this.newTaskForm.reset();
        });

        this.cancelNewTask.addEventListener('click', () => {
            this.newTaskModal.classList.remove('show');
            this.newTaskForm.reset();
        });

        // Cerrar modal al hacer clic fuera
        this.newTaskModal.addEventListener('click', (e) => {
            if (e.target === this.newTaskModal) {
                this.newTaskModal.classList.remove('show');
                this.newTaskForm.reset();
            }
        });

        // Manejar el envío del formulario
        this.newTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = this.taskTitle.value.trim();
            
            if (title) {
                this.taskManager.addTask(title, this.currentPriority);
                this.newTaskModal.classList.remove('show');
                this.newTaskForm.reset();
            }
        });

        // Manejar el menú de prioridades
        if (this.priorityButton && this.priorityDropdown) {
            this.priorityButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.priorityDropdown.classList.toggle('show');
            });

            // Cerrar el menú de prioridades al hacer clic fuera
            document.addEventListener('click', () => {
                this.priorityDropdown.classList.remove('show');
            });

            // Manejar selección de prioridad
            const priorityOptions = this.priorityDropdown.querySelectorAll('.priority-option');
            priorityOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    const priority = e.currentTarget.dataset.priority;
                    this.currentPriority = this.getPriorityValue(priority);
                    this.updatePriorityButton(priority);
                    this.priorityDropdown.classList.remove('show');
                });
            });
        }
    }

    getPriorityValue(priority) {
        const priorities = {
            '1': 'alta',
            '2': 'normal',
            '3': 'baja',
            '4': 'normal'
        };
        return priorities[priority] || 'normal';
    }

    updatePriorityButton(priority) {
        const flags = {
            '1': '🔴',
            '2': '🟡',
            '3': '🔵',
            '4': '⚪'
        };
        if (this.priorityButton) {
            this.priorityButton.querySelector('.task-form__option-icon').textContent = flags[priority];
        }
    }
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    new ThemeManager();
    new App();
}); 