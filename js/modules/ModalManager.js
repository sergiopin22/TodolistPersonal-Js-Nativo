export class ModalManager {
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