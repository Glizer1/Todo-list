
let tasksDb = [
    { id: '0', name: "Task 1", status: false, sectionId: '0' },
    { id: '1', name: "Task 2", status: true, sectionId: '0' },
    { id: '2', name: "Task 1", status: false, sectionId: '1' }
]

let sectionsDb = [
    { id: '0', name: "Section 1" },
    { id: '1', name: "Section 2" }
]

// -- backEnd --
 
// CRUD:
function createSection(name) {
    if (typeof name !== 'string') return

    const createId = generateId()
    sectionsDb.push({ id: createId, name: name })

    console.log('createSection => ', sectionsDb)
}

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

// createSection system
function addPreviewSection(event) {
    // mudar: outro template
    const sectionPreviewTemplate = `
        <div class="project-section" data-sectionId="1">
            <div class="section-header">
                <div class="section-title">
                    <input type="text" class="section-name-input" placeholder="Section name">
                </div>
            </div>
            <div class="task-list"></div>
        </div>
    `

    const sectionList = document.querySelector('.project-board')
    sectionList.insertAdjacentHTML('beforeend', sectionPreviewTemplate)

    const inputName = sectionList.lastElementChild.querySelector('.section-name-input')

    inputName.addEventListener('blur', handleEnterSectionName)
    

    inputName.addEventListener('keydown', (event) => {    
        if (event.key === 'Enter') {
            handleEnterSectionName(event)
        }
    })

    inputName.focus()
}

function createSectionItem(sectionName, sectionId) {
    const newSection = `
        <div class="project-section" data-sectionId="${sectionId}">
            <div class="section-header">
                <div class="section-title">
                    <span class="title-text">${sectionName}</span>
                </div>
            </div>
            <div class="task-list"></div>
            <div class="task-adder">
                <input type="button" class="add-task-button" value="Add task">
            </div>
        </div>
    `
    const sectionList = document.querySelector('.project-board')
    sectionList.insertAdjacentHTML('beforeend', newSection)
}

function handleEnterSectionName(event) {
    const input = event.target
    removeEventListeners(input)

    const sectionList = input.closest('.project-board')
    const previewSection = sectionList.lastElementChild
    sectionList.removeChild(previewSection)

    const sectionName = input.value.trim()
    if (!sectionName) return
    createSection(sectionName)
    updateProjectBoard() 
}


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

    const taskList = input.closest('.task-list')
    const previewTask = taskList.lastElementChild
    taskList.removeChild(previewTask)

    const taskName = input.value.trim()
    const sectionId = input.closest('.project-section').dataset.sectionid

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
    input.removeEventListener('blur', handleEnterSectionName)
}

function clearProjectBoard() {
    const sectionList = document.querySelectorAll('.project-section')
    sectionList.forEach(section => {
        section.remove()
    })
}

function updateProjectBoard() {
    clearProjectBoard()
    sectionsDb.forEach(section => createSectionItem(section.name, section.id))
    tasksDb.forEach(task => createTaskItem(task.name, task.status, task.id, task.sectionId))
}

updateProjectBoard()

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

const addSectionButton = document.querySelector('.add-section')
addSectionButton.addEventListener('click', addPreviewSection)


