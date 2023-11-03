
let tasksDb = [
    { id: '0', name: "Task 1", status: false, sectionId: '0' },
    { id: '1', name: "Task 2", status: true, sectionId: '0' },
    { id: '2', name: "Task 1", status: false, sectionId: '1' }
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
    tasksDb.push({ id: createId, name, status: false, sectionId })

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

function toggleTaskStatus(status, taskId) {
    if (typeof status !== "boolean") return
    
    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    tasksDb[findTaskIndex].status = status
    console.log("toggleTaskStatus => ", tasksDb[findTaskIndex])
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

 // createTask system:

function addPreviewTask(event) {
    console.log(event)

    const target = event.target
    const section = target.closest('.project-section')

    const taskPreviewTemplate = `
        <input type="text" class="task-name-input" placeholder="Task name">
    `

    const taskList = section.querySelector('.task-list')
    
    taskList.insertAdjacentHTML('beforeend', taskPreviewTemplate);

    const input = taskList.lastElementChild
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

    const taskList = input.closest('.task-list')
    const previewTask = taskList.lastElementChild
    taskList.removeChild(previewTask)

    if (taskName) {
        createTask(taskName, sectionId)

        updateTaskList()
    }
}

function createTaskItem(taskName, taskStatus, taskId, sectionId) {
        const newTask = `
            <div class="task" data-taskId="${taskId}">
                <input type="checkbox" class="task-checkbox" ${taskStatus}>
                <div class="task-title">
                    <span class="task-text">${taskName}</span>
                </div>
            </div>
        `

        const section = document.querySelector(`[data-sectionId="${sectionId}"]`)
        const taskList = section.querySelector('.task-list')
    
        taskList.insertAdjacentHTML('beforeend', newTask);
}
 
function clearTaskList() {
    const taskList = document.querySelectorAll('.task')
    taskList.forEach(task => {
        task.remove()
    })
}

function updateTaskList() {
    clearTaskList()

    tasksDb.forEach(taskList => createTaskItem(taskList.name, taskList.status, taskList.id, taskList.sectionId))
}



const addTaskButton = document.querySelectorAll('.add-task-button')
addTaskButton.forEach(button => {
    button.addEventListener('click', addPreviewTask)
})


