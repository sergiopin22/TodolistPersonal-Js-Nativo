import { CONSTANTS } from '../constants/appConstants.js';

export class ThemeManager {
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