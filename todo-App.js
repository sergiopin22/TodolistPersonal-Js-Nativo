const d = document;
const w = window;
const ls = window.localStorage;
const $fragment = d.createDocumentFragment();
const $input = d.querySelector(".input")

const resetAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.play()
  };

  function darkMode(btnSelector, darkSelector) {
    const $btnDark = document.querySelector(btnSelector);
    const $activeModeDark = document.querySelector(darkSelector);
    const moon = `🌙`;
    const sun = `☀️`;
  
    const setTheme = (theme) => {
      $btnDark.textContent = theme === "light" ? moon : sun;
      $activeModeDark.classList.toggle("modeDark", theme === "dark");
      localStorage.setItem("theme", theme);
    };
  
    const toggleTheme = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      setTheme(newTheme);
    };
  
    document.addEventListener("click", (e) => {
      if (e.target.matches(btnSelector)) {
        toggleTheme();
      }
    });
  
    document.addEventListener("DOMContentLoaded", () => {
      const theme = localStorage.getItem("theme") || "light";
      setTheme(theme);
    });
  }
  
  darkMode(".btn-Dark", ".main");
  

// funcion para añadir tareas 
const fullTask = []

const createTask = () => {
    const $containTask = document.createElement("div");
    const $titleTask = document.createElement("h2");
    const $optionTask = document.createElement("div");
    const $editTask = document.createElement("button");
    const $completeEditTask = document.createElement("button");
    const $deleteTask = document.createElement("button");
    const $idContaintTask = fullTask.length - 1;
  
    $containTask.appendChild($titleTask);
    $containTask.appendChild($optionTask);
    $optionTask.appendChild($editTask);
    $optionTask.appendChild($completeEditTask);
    $optionTask.appendChild($deleteTask);
  
    $containTask.classList.add("containt-task");
    $optionTask.classList.add("options");
    $editTask.classList.add(`edite${$idContaintTask}`, "edite-task");
    $completeEditTask.classList.add(`complete${$idContaintTask}`, "complete-edite-task");
    $deleteTask.classList.add(`delete${$idContaintTask}`, "delete-task");
    $editTask.textContent = "Editar✏️";
    $completeEditTask.textContent = "Editado";
    $deleteTask.textContent = "✔️"
    $titleTask.textContent = fullTask[$idContaintTask];
    $deleteTask.dataset.delete = $idContaintTask;
    $editTask.dataset.edite = $idContaintTask;
    $containTask.dataset.contain = $idContaintTask;
  
    $containTask.style.display = "flex";
    $containTask.style.flexDirection = "column";
    $containTask.style.textAlign = "center";
    $completeEditTask.style.display = "none";
  
    const deleteTask = () => {
      document.addEventListener("click", (e) => {
        if (e.target.matches(`.delete${$idContaintTask}`) && $deleteTask.dataset.delete === $containTask.dataset.contain) {
          fullTask.splice($idContaintTask, 1);
          $containTask.remove();
          resetAudio(taskCompleteSound);
        }
      });
    };
  
    const editeTask = () => {
      document.addEventListener("click", (e) => {
        if (e.target.matches(`.edite${$idContaintTask}`) && $editTask.dataset.edite === $containTask.dataset.contain) {
          $titleTask.setAttribute("contenteditable", "true");
          $titleTask.classList.add("editarTitle");
          $deleteTask.disabled = true;
          $editTask.disabled = true;
          $completeEditTask.style.display = "inline";
  
          if ($titleTask.textContent.length === 0 || $titleTask.textContent.length > 30) {
            $containTask.remove();
          }
        }
      });
  
      document.addEventListener("click", (e) => {
        if (e.target.matches(`.complete-edite-task`)) {
          $titleTask.setAttribute("contenteditable", "false");
          $titleTask.classList.remove("editarTitle");
          $deleteTask.disabled = false;
          $editTask.disabled = false;
          $completeEditTask.style.display = "none";
  
          if ($titleTask.textContent.length === 0 || $titleTask.textContent.length > 30) {
            $containTask.remove();
          }
        }
      });
    };
  
    editeTask();
    deleteTask();
  
    $fragment.appendChild($containTask);
    document.body.appendChild($fragment);
  };
  
  document.addEventListener("keydown", (event) => {
    if (event.target.matches(".input") && event.key === "Enter") {
      const inputValue = $input.value.trim();
  
      if (inputValue === "") {
        alert("NO SE PUEDEN MANDAR TAREAS VACIAS");
      } else if (inputValue.length <= 30) {
        fullTask.push(inputValue);
        $input.value = "";
        createTask();
      } else {
        alert("Tareas máximo con 30 caracteres. No se pueden crear tareas más largas.");
        $input.value = "";
      }
    }
  });
  


//   modal
window.addEventListener("DOMContentLoaded", () => {
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modal = document.getElementById("modal");
  
    const closeModal = () => {
      modal.style.display = "none";
    };
  
    closeModalBtn.addEventListener("click", closeModal);
  
    modal.style.display = "flex";
  });
  