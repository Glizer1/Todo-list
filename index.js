
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

function toggleTaskStatus(taskId) {    
    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    tasksDb[findTaskIndex].status = tasksDb[findTaskIndex].status === true ? false : true
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

    const inputName = taskList.lastElementChild

    inputName.addEventListener('blur', handleEnterTaskName)
    

    inputName.addEventListener('keydown', (event) => {    
        if (event.key === 'Enter') {
            handleEnterTaskName(event)
        }
    })

    inputName.focus()
}

function createTaskItem(taskName, isCheked, taskId, sectionId) {
        const taskStatus = isCheked === true ? 'checked' : ''

        const newTask = `
            <div class="task" data-taskId="${taskId}">
                <input type="checkbox" class="task-checkbox" ${taskStatus}>
                <div class="task-title">
                    <span class="task-text">${taskName}</span>
                </div>
                <div class="delete-button-content">
                    <input type="button" class="delete-button" value="del">
                </div>
            </div>
        `

        const section = document.querySelector(`[data-sectionId="${sectionId}"]`)
        const taskList = section.querySelector('.task-list')
    
        taskList.insertAdjacentHTML('beforeend', newTask);
}

function handleEnterTaskName(event) {
    const input = event.target
    removeEventListeners(input)

    const taskName = input.value.trim()

    const sectionId = input.closest('.project-section').dataset.sectionid

    const taskList = input.closest('.task-list')
    const previewTask = taskList.lastElementChild
    taskList.removeChild(previewTask)

    if (!taskName) return
        createTask(taskName, sectionId)

        updateTaskList()
}

 //-- update task --
// renameTask system
function showRenameInput(event) {
    const target = event.target
    console.log(target)
    
    const renameInput = `
    <input type="text" class="task-name-input" placeholder="Task name">
    `
    const taskTitle = target.querySelector('.task-text')
    console.log(taskTitle)
    
    taskTitle.style.display = 'none' // Mudar: add em css
    taskTitle.insertAdjacentHTML('afterend', renameInput);

    const inputName = taskTitle.nextElementSibling

    inputName.addEventListener('blur', handleRenameTask)
    

    inputName.addEventListener('keydown', (event) => {    
        if (event.key === 'Enter') {
            handleRenameTask(event)
        }
    })

    inputName.focus()
}

function handleRenameTask(event) {
    const input = event.target
    removeEventListeners(input)

    const taskName = input.value.trim()
    const taskId = input.closest('.task').dataset.taskid
    console.log(taskId)

    const taskList = input.closest('.task-list')
    const previewTask = taskList.lastElementChild
    taskList.removeChild(previewTask)

    if (!taskName) return
        renameTask(taskName, taskId)

        updateTaskList()
}

// toggle task status
function toggleTaskItemStatus(event) {
    const target = event.target
    const taskId = target.closest('.task').dataset.taskid

    toggleTaskStatus(taskId)

    updateTaskList()
}


// deleteTask systemw
function deleteTaskItem(event) {
    const target = event.target
    const taskId = target.closest('.task').dataset.taskid

    if (!taskId) return

    deleteTask(taskId)
    updateTaskList()
}

// outros

function removeEventListeners(input) {
    input.removeEventListener('blur', handleEnterTaskName)
    input.removeEventListener('blur', handleRenameTask)
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

updateTaskList()

//inputs

const projectBoard = document.querySelector('.project-board')
projectBoard.addEventListener('dblclick', (event) => {
    const target = event.target

    if (target.classList.contains('task-title')) {
        showRenameInput(event)
    }
})

projectBoard.addEventListener('click', (event) => {
    const target = event.target

    if (target.classList.contains('add-task-button')) {
        addPreviewTask(event)
    }

    if (target.classList.contains('delete-button')) {
        deleteTaskItem(event)
    }

    if (target.classList.contains('task-checkbox')) {
        toggleTaskItemStatus(event)
    }
})


