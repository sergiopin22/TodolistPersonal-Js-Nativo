const d = document;
const w = window;
const ls = window.localStorage;
const $fragment = d.createDocumentFragment();
const $input = d.querySelector(".input")

// Constantes globales
const CONSTANTS = {
    MAX_TASK_LENGTH: 30,
    THEME: {
        LIGHT: 'light',
        DARK: 'dark'
    },
    ICONS: {
        MOON: '🌙',
        SUN: '☀️',
        EDIT: '✏️',
        DELETE: '✔️'
    }
};

// Utilidades
const resetAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
};

// Gestor de tema
class ThemeManager {
    constructor(btnSelector, darkSelector) {
        this.btnSelector = btnSelector;
        this.darkSelector = darkSelector;
        this.btnDark = document.querySelector(btnSelector);
        this.activeModeDark = document.querySelector(darkSelector);
        this.init();
    }

    setTheme(theme) {
        this.btnDark.textContent = theme === CONSTANTS.THEME.LIGHT ? CONSTANTS.ICONS.MOON : CONSTANTS.ICONS.SUN;
        this.activeModeDark.classList.toggle("modeDark", theme === CONSTANTS.THEME.DARK);
        localStorage.setItem("theme", theme);
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem("theme") || CONSTANTS.THEME.LIGHT;
        const newTheme = currentTheme === CONSTANTS.THEME.LIGHT ? CONSTANTS.THEME.DARK : CONSTANTS.THEME.LIGHT;
        this.setTheme(newTheme);
    }

    init() {
        // Aplicar tema inicial
        const savedTheme = localStorage.getItem("theme") || CONSTANTS.THEME.LIGHT;
        this.setTheme(savedTheme);

        // Agregar evento click al botón
        this.btnDark.addEventListener("click", () => {
            this.toggleTheme();
        });
    }
}

// Gestor de tareas
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.fragment = document.createDocumentFragment();
        this.input = document.querySelector(".input");
        this.taskCompleteSound = new Audio('8-bit-powerup-6768.mp3');
        this.init();
        this.renderSavedTasks();
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderSavedTasks() {
        this.tasks.forEach((task, index) => {
            const taskElements = this.createTaskElement(task, index);
            this.setupTaskEvents(taskElements, index);
            this.fragment.appendChild(taskElements.taskContainer);
        });
        document.body.appendChild(this.fragment);
    }

    createTaskElement(taskText, taskId) {
        const taskContainer = document.createElement("div");
        const titleTask = document.createElement("h2");
        const optionsContainer = document.createElement("div");
        const editButton = document.createElement("button");
        const completeEditButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        taskContainer.classList.add("containt-task");
        optionsContainer.classList.add("options");
        editButton.classList.add(`edite${taskId}`, "edite-task");
        completeEditButton.classList.add(`complete${taskId}`, "complete-edite-task");
        deleteButton.classList.add(`delete${taskId}`, "delete-task");

        editButton.textContent = `Editar${CONSTANTS.ICONS.EDIT}`;
        completeEditButton.textContent = "Editado";
        deleteButton.textContent = CONSTANTS.ICONS.DELETE;
        titleTask.textContent = taskText;

        deleteButton.dataset.delete = taskId;
        editButton.dataset.edite = taskId;
        taskContainer.dataset.contain = taskId;

        taskContainer.style.display = "flex";
        taskContainer.style.flexDirection = "column";
        taskContainer.style.textAlign = "center";
        completeEditButton.style.display = "none";

        taskContainer.appendChild(titleTask);
        taskContainer.appendChild(optionsContainer);
        optionsContainer.appendChild(editButton);
        optionsContainer.appendChild(completeEditButton);
        optionsContainer.appendChild(deleteButton);

        return { taskContainer, titleTask, editButton, completeEditButton, deleteButton };
    }

    setupTaskEvents(taskElements, taskId) {
        const { taskContainer, titleTask, editButton, completeEditButton, deleteButton } = taskElements;

        deleteButton.addEventListener("click", () => {
            this.tasks.splice(taskId, 1);
            this.saveTasks();
            taskContainer.remove();
            resetAudio(this.taskCompleteSound);
        });

        editButton.addEventListener("click", () => {
            titleTask.setAttribute("contenteditable", "true");
            titleTask.classList.add("editarTitle");
            deleteButton.disabled = true;
            editButton.disabled = true;
            completeEditButton.style.display = "inline";
        });

        completeEditButton.addEventListener("click", () => {
            if (this.validateTaskContent(titleTask)) {
                titleTask.setAttribute("contenteditable", "false");
                titleTask.classList.remove("editarTitle");
                deleteButton.disabled = false;
                editButton.disabled = false;
                completeEditButton.style.display = "none";
                this.tasks[taskId] = titleTask.textContent;
                this.saveTasks();
            }
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

        this.tasks.push(taskText);
        this.saveTasks();
        const taskId = this.tasks.length - 1;
        const taskElements = this.createTaskElement(taskText, taskId);
        this.setupTaskEvents(taskElements, taskId);
        this.fragment.appendChild(taskElements.taskContainer);
        document.body.appendChild(this.fragment);
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

// Gestor del modal
class ModalManager {
    constructor() {
        this.modal = document.getElementById("modal");
        this.closeModalBtn = document.getElementById("closeModalBtn");
        this.init();
    }

    closeModal() {
        this.modal.style.display = "none";
    }

    init() {
        this.closeModalBtn.addEventListener("click", () => this.closeModal());
        this.modal.style.display = "flex";
    }
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    new ThemeManager(".btn-Dark", ".main");
    new TaskManager();
    new ModalManager();
});
  