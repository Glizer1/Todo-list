
let tasksDb = [
    { id: '0', name: "Task 1", checked: false, sectionId: '0' },
    { id: '1', name: "Task 2", checked: true, sectionId: '0' },
    { id: '2', name: "Task 1", checked: false, sectionId: '1' }
]

let sectionsDb = [
    { id: '0', sectionName: "Section 1" },
    { id: '1', sectionName: "Section 2" }
]

// -- backEnd --
/**
 - createTask
 - renameTask
 - toggleChekedState
 - deleteTask
 - generateId
 */

 
// CRUD:
function createTask(name, sectionId) {
    if (typeof name !== "string") return

    const findSection = sectionsDb.find(section => sectionId === section.id)
    if (!findSection) return

    const createId = generateId()
    tasksDb.push({ id: createId, name, checked: false, sectionId })

    console.log("createTask => ", tasksDb)
}

function findTaskIndexById(taskId) {
    const findTaskIndex = tasksDb.findIndex(task => taskId === task.id)
    if (findTaskIndex === -1) return false

    return findTaskIndex
}

function renameTask(newName, taskId) {
    if (typeof newName !== "string") return

    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    tasksDb[findTaskIndex].name = newName
    console.log("renameTask => ", tasksDb, tasksDb[findTaskIndex])
}

function toggleChekedState(isChecked, taskId) {
    if (typeof isChecked !== "boolean") return
    
    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    tasksDb[findTaskIndex].checked = isChecked
    console.log("toggleCheckedState => ", tasksDb[findTaskIndex])
}

function changeTaskSection(taskId, sectionId) {
    const findSection = sectionsDb.find(section => sectionId === section.id)
    if (!findSection) return

    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    tasksDb[findTaskIndex].sectionId = sectionId
    console.log("changeTaskSection => ", tasksDb[findTaskIndex])
}


function deleteTask(taskId) {
    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    tasksDb.splice(findTaskIndex, 1)
    console.log("deleteTask => ", tasksDb)
}

// Others
function generateId() {
    const date = Date.now()
    const randomString = Math.random().toString(36).slice(2)

    return randomString + date
}

// -- frontEnd -- 

// etapas para add Task
/**
 1. clicar Add task: adiconar um preview de task com input para o nome
 2. verificar ao mandar input: verifica se o nome está dentro dos parametros
 3. Cria a task na DB: chama a funçao de criar task
 */

function addPreviewTask(event) {
    console.log(event)

    const target = event.target
    const section = target.closest('.project-section')

    const taskPreviewTemplate = `
        <div class="task">
            <input type="checkbox" class="task-checkbox">
            <div class="task-title">
                <span class="task-text"></span>
                <input type="text" class="task-name-input" placeholder="Task name">
            </div>
        </div>
    `
    
    const taskList = section.querySelector('.task-list')
    
    taskList.insertAdjacentHTML('beforeend', taskPreviewTemplate);

    const input = taskList.lastElementChild.querySelector('.task-name-input')
    input.focus()

    addEventListeners(input)
}

function addEventListeners(input) {
    input.addEventListener('blur', handleEnterTaskName)
    

    input.addEventListener('keydown', (event) => {
        const keyPressed = event.key
    
        if (keyPressed === 'Enter') {
            handleEnterTaskName(event)
        }
    })
}

function removeEventListeners(input) {
    input.removeEventListener('blur', handleEnterTaskName)
}

function handleEnterTaskName(event) {
    const input = event.target
    removeEventListeners(input)

    const taskName = input.value.trim()

    const sectionId = input.closest('.project-section').dataset.sectionid

    if (taskName) {
        createTask(taskName, sectionId)
        
        input.style.display = 'none' // Mudar: add in css
    } else {
        const taskList = input.closest('.task-list')
        const previewTask = taskList.lastElementChild
        taskList.removeChild(previewTask)
    }

}

const addTaskButton = document.querySelectorAll('.add-task-button')
addTaskButton.forEach(button => {
    button.addEventListener('click', addPreviewTask)
})


