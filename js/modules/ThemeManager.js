import { CONSTANTS } from '../constants/appConstants.js';

export class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.app = document.body;
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        this.init();
    }

    init() {
        // Aplicar tema inicial
        this.updateTheme();

        // Escuchar cambios en el botón
        this.themeToggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            this.updateTheme();
            localStorage.setItem('darkMode', this.isDarkMode);
        });
    }

    updateTheme() {
        if (this.isDarkMode) {
            this.app.classList.add('dark-theme');
            this.themeToggle.querySelector('.theme-toggle__icon').textContent = '☀️';
        } else {
            this.app.classList.remove('dark-theme');
            this.themeToggle.querySelector('.theme-toggle__icon').textContent = '🌙';
        }
    }
} 