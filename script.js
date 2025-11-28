// Sabse uper ham create karege local storage ka logic taaki jab bhi page reload ho to hamare task waha par bane rahe.

let tasksData = {}
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];
let dragElement = null;


function AddTask(title,desc,column){
    const div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', 'true');

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button> 
    `
    column.appendChild(div);

    div.addEventListener('drag', (e) =>{
        dragElement = div;
    }) 
    
    const deleteBtn = div.querySelector('button');
    deleteBtn.addEventListener('click',() =>{
        div.remove();
        updateTaskCount();

    })
    
    
    return div;

}

function updateTaskCount(){
     columns.forEach(col =>{
            const tasks = col.querySelectorAll('.task')
            const count = col.querySelector('.heading .right');
  
            // ye sara data ham local storage mai save kar rahe hai.
            // in the form of object.   

            tasksData[col.id]  = Array.from(tasks).map(t =>{
                return {
                    title : t.querySelector('h2').innerText,
                    desc : t.querySelector('p').innerText
                } 

            })
            // ab is object koo string mai convert kar ke local storage mai save kar denge.
            // because local storage sirf string ko hi store kar sakta hai.
            // aur hamara object hai isiliye ham isai string mai convert kar rahe hai.


            localStorage.setItem('tasks',JSON.stringify(tasksData));
            count.innerText = tasks.length;

        })

}

if (localStorage.getItem('tasks')){
    // object ko wapas se parse kar ke le aate hai.
    const data = JSON.parse(localStorage.getItem('tasks'));

    for (const col in data){
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task =>{
            AddTask(task.title, task.desc, column);
        })

        updateTaskCount();
    }
}
// highlight

const tasks = document.querySelectorAll('.task');

tasks.forEach(task =>{
    task.addEventListener('drag', (e)=>{
        // console.log("dragging", e);
        dragElement = task;


    })
})

//  we use drag enter event from drag

// progress.addEventListener("dragenter", (e) =>{
//     // console.log("drag enter",e);
//     progress.classList.add("hover-over");
// })

// progress.addEventListener("dragleave",(e) =>{
//     progress.classList.remove('hover-over');

// })

// todo.addEventListener("dragenter", (e) =>{
//     // console.log("drag enter",e);
//     done.classList.add("hover-over");
// })

// todo.addEventListener("dragleave",(e) =>{
//     done.classList.remove('hover-over');

// })

// done.addEventListener("dragenter", (e) =>{
//     // console.log("drag enter",e);
//     done.classList.add("hover-over");
// })

// done.addEventListener("dragleave",(e) =>{
//     done.classList.remove('hover-over');

// })

//? iski jagah par hame ek function bana sakte hai.

function addDragEventsOnColumn(column){
    column.addEventListener("dragenter" , (e) =>{
        e.preventDefault();
        column.classList.add("hover-over");
    })

    column.addEventListener("dragleave", (e) =>{
        e.preventDefault();
        column.classList.remove("hover-over");
    })

    // drag karke usai drop karna hai.

    column.addEventListener('dragover',(e) =>{
        e.preventDefault();

    })

    column.addEventListener("drop", (e)=>{
        e.preventDefault();
        

        column.appendChild(dragElement);
        column.classList.remove('hover-over');

        // ye ha i count koo badane our ghatane ka logic.
        // is code sai agar ham page  koo relode bhi karaege tau ye change nahi hogaa.

        updateTaskCount();


    })

}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);


// modal button related logic

const toggleModalBtn = document.querySelector('#toggle-modal');
const modal = document.querySelector('.modal');
const addTaskBtn = document.querySelector('.add-task-btn');
const modalBg = document.querySelector('.modal .bg');

toggleModalBtn.addEventListener('click', () =>{
    // toggle matlab ki jo class hai wo agar hai to hata do aur agar nahi hai to add kar do.
    modal.classList.toggle('active');

})

modalBg.addEventListener('click', (e) =>{
    modal.classList.remove('active');
})

addTaskBtn.addEventListener('click', () =>{

    const taskTitle = document.querySelector('#task-title-input').value
    const taskDescription = document.querySelector('#task-desc-input').value

    AddTask(taskTitle, taskDescription, todo);
    
     updateTaskCount();

     // modal hatt jaye isiliye remove kar rahai hai active koo.

    modal.classList.remove('active');

    document.querySelector('#task-title-input').value = '';
    document.querySelector('#task-desc-input').value = '';


})