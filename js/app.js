import { ThemeManager } from './modules/ThemeManager.js';
import { TaskManager } from './modules/TaskManager.js';
import { ModalManager } from './modules/ModalManager.js';

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    new ThemeManager(".btn-Dark", ".main");
    new TaskManager();
    new ModalManager();
}); 