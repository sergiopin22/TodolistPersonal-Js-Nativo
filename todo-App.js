const d = document;
const w = window;
const ls = window.localStorage;
const $fragment = d.createDocumentFragment();
const $input = d.querySelector(".input")



function darkMode(btn,Dark){
    
    const $btnDark = d.querySelector(btn);
    const $activeModeDark = d.querySelector(Dark);
    const moon = `🌙`
    const sun = `☀️`

    const modeDark = () =>{
        $activeModeDark.classList.add("modeDark")
        $btnDark.textContent = sun;
        ls.setItem("theme","dark")    
    }
    
    const modeLight = () =>{
        $btnDark.textContent = moon;
        ls.setItem("theme","light")    
        $activeModeDark.classList.remove("modeDark")
    }

    d.addEventListener("click", e =>{
        if(e.target.matches(btn)){
            if($btnDark.textContent === moon){
                modeDark();
            }
            else{
                modeLight();
            }
        }
        
    })

    d.addEventListener("DOMContentLoaded", e=>{
        //console.log(ls.getItem("theme"))//le estamos preguntando si existe theme en localstorage = null
        //alert("Hola desde la funcion darktheme")
        if(ls.getItem("theme" === null))ls.setItem("theme","light")//si no existe theme la vamos a crear y le vamos a dar el valor de ligth
        if(ls.getItem("theme") === "light" )modeLight();
        if(ls.getItem("theme") === "dark" )modeDark();
    })

}

darkMode(".btn-Dark", ".main")

// funcion para añadir tareas 
const fullTask = []






const createTask = ()=>{
    // vamos a crearnos los elementos 
    
    const $containTask = d.createElement("div")
    const $titleTask = d.createElement("h2")
    const $optionTask = d.createElement("div")
    const $editTask = d.createElement("button")
    const $completeEditTask = d.createElement("button")
    const $deleteTask = d.createElement("button")
    let $idContaintTask = fullTask.length - 1;

        $containTask.appendChild($titleTask)
        $containTask.appendChild($optionTask)
        $optionTask.appendChild($editTask)
        $optionTask.appendChild($completeEditTask)
        $optionTask.appendChild($deleteTask)
    
        $containTask.classList.add(`containt-task`)
        $optionTask.classList.add("options")
        $editTask.classList.add(`edite${$idContaintTask}`)
        $editTask.classList.add(`edite-task`)
        $completeEditTask.classList.add(`complete-edite-task`)
        $editTask.textContent = `Editar †`
        $completeEditTask.textContent = `Editado`
        $completeEditTask.classList.add(`complete${$idContaintTask}`)
        $deleteTask.textContent = `«`
        $deleteTask.classList.add(`delete${$idContaintTask}`)
        $deleteTask.classList.add(`delete-task`)
        $titleTask.textContent = fullTask[fullTask.length - 1].toUpperCase();
        $deleteTask.dataset.delete = $idContaintTask;
        $editTask.dataset.edite = $idContaintTask;
        $containTask.dataset.contain = $idContaintTask;

        // estilos al div contenedor de las tareas ($containTask), para organizar el contenido
        $containTask.style.setProperty("display","flex")
        $containTask.style.setProperty("flex-direction","column")
        $containTask.style.setProperty("text-align","center")
        $completeEditTask.style.setProperty("display","none");
        // estilos al button editar
        
        // estilos al button eliminar

    
    console.log(fullTask)
    console.log(fullTask.length)
    console.log( $idContaintTask)
    console.log( $deleteTask.dataset.delete)
    console.log( $containTask.dataset.contain)
    
    $fragment.appendChild($containTask)
    d.body.appendChild($fragment)
    // d.body.appendChild($fragment)
    // const errorMessage = (message = "mensaje de error prueba") =>{
    //     let $errorTask = d.createElement("div")
    //     const $errorTitle = d.createElement("h2")
    
    //     $errorTask.classList.add(`error-task`)
    //     $errorTitle.classList.add(`error-title`)
    //     $errorTitle.textContent = `AVISO ERROR`
        
        
    //     $errorTask.innerHTML = `<h2>${$errorTitle.textContent}</h2> <p>${message}</p>`;
    //     d.addEventListener(`click`, e =>{
    //         if(e.target.matches(`.complete${$idContaintTask}`) && $editTask.dataset.edite  === $containTask.dataset.contain){
    //             setTimeout(() => { 
    //                 $errorTask.style.setProperty("display","none"); 
    //                 console.log($editTask.dataset.edite + "editTask")         
    //                 console.log($containTask.dataset.contain + "containTask")         
    //             }, 1000);
    //             // Ingresa minimo un caracter maximo 30, pero no puede estar vacio.
    //             $fragment.appendChild($errorTask)
    //             d.body.appendChild($fragment)
    //         }
    //     })
    // }


    const deleteTask = ()=>{        
        //evento para detectar si tocan el boton eliminar
        d.addEventListener('click',(e) =>{
            if(e.target.matches(`.delete${$idContaintTask}`) && $deleteTask.dataset.delete === $containTask.dataset.contain){
                // alert(`esta caja es la ${$idContaintTask} a eliminar`);
                    fullTask.splice(fullTask[$idContaintTask],1)
                    $containTask.remove(`contain-task`)
            }
        })
    }

    const editeTask = ()=>{
        // evento para detectar si tocan el boton editar
        d.addEventListener(`click`,(e)=>{
            if(e.target.matches(`.edite${$idContaintTask}`) && $editTask.dataset.edite === $containTask.dataset.contain){
                // alert(`esta caja es la ${$idContaintTask} a editar`);
                $titleTask.setAttribute("contenteditable","true")
                if($titleTask.textContent === $titleTask.textContent){
                    $titleTask.classList.add("editarTitle")
                    
                    $deleteTask.setAttribute("disabled", "true")
                    $editTask.setAttribute("disabled", "true")
                    $completeEditTask.style.setProperty("display","inline");
                    if($titleTask.textContent.length <= 30 && $titleTask.textContent.length > 0){
                        //  $titleTask.textContent = $titleTask.content
                        d.addEventListener(`click`,(e)=>{
                            if(e.target.matches(`.complete-edite-task`)){
                                $titleTask.setAttribute("contenteditable","false")
                                $titleTask.classList.remove("editarTitle")
                                console.log($titleTask.textContent.length)
                                $deleteTask.disabled = false;
                                $editTask.disabled = false;
                                $completeEditTask.style.setProperty("display","none");
                                if($titleTask.textContent.length === 0 || $titleTask.textContent.length > 30){
                                    $containTask.remove(`contain-task`)
                                    console.log("")
                                    // alert("Ingresa minimo un caracter maximo 30, pero no puede estar vacio.")
                                }
                            }   
                        })
                        
                    }
                    
                    
                }
            }
        })
    }
    
    editeTask()
    deleteTask()
}

// vamos a pushear task al fullTask
d.addEventListener("keydown",(event)=>{

    if(event.target.matches(".input") && event.key === "Enter" && $input.value === ""){
        alert("NO SE PUEDEN MANDAR TAREAS VACIAS")
    }
    if(event.target.matches(".input") && event.key === "Enter" && $input.value !== ""){
        if($input.value.length <= 30){
            let nuevaTask = fullTask.push($input.value)
            // console.log(fullTask)
            $input.value = "";
            createTask()
        }
        else{
            alert("Tareas maximo con 30 caracteres, mayor a lo anterior no se podran crear tareas igual al editar una tarea")
            $input.value = "";
        }
    }
})


