export class TaskModal {
    constructor() {
        this.modal = document.getElementById('taskModal');
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.priorityButton = document.getElementById('priorityButton');
        this.priorityDropdown = document.getElementById('priorityDropdown');
        this.priorityOptions = document.querySelectorAll('.priority-option');
        this.currentPriority = 4; // Prioridad por defecto: ninguna

        this.init();
    }

    init() {
        // Botón flotante para abrir el modal
        const fab = document.getElementById('fab');
        fab.addEventListener('click', () => this.openModal());

        // Cerrar modal al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Manejar el menú de prioridades
        this.priorityButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePriorityDropdown();
        });

        // Cerrar el menú de prioridades al hacer clic fuera
        document.addEventListener('click', () => {
            this.priorityDropdown.classList.remove('show');
        });

        // Manejar selección de prioridad
        this.priorityOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const priority = parseInt(e.currentTarget.dataset.priority);
                this.updatePriority(priority);
                this.priorityDropdown.classList.remove('show');
            });
        });

        // Manejar envío del formulario
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Manejar tecla Enter en el input
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit();
            }
        });
    }

    openModal() {
        this.modal.classList.add('show');
        this.taskInput.focus();
    }

    closeModal() {
        this.modal.classList.remove('show');
        this.taskInput.value = '';
        this.currentPriority = 4;
        this.updatePriorityButton(4);
    }

    togglePriorityDropdown() {
        this.priorityDropdown.classList.toggle('show');
    }

    updatePriority(priority) {
        this.currentPriority = priority;
        this.updatePriorityButton(priority);
    }

    updatePriorityButton(priority) {
        const flags = ['🔴', '🟡', '🔵', '⚪'];
        this.priorityButton.innerHTML = flags[priority - 1];
        this.priorityButton.dataset.priority = priority;
    }

    handleSubmit() {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            // Emitir evento personalizado con los datos de la tarea
            const event = new CustomEvent('newtask', {
                detail: {
                    text: taskText,
                    priority: this.currentPriority
                }
            });
            document.dispatchEvent(event);
            
            this.closeModal();
        }
    }
} 