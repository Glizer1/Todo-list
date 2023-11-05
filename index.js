
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

function findSectionIndexById(sectionId) {
    const findSectionIndex = sectionsDb.findIndex(section => sectionId === section.id)
    if (findSectionIndex === -1) return false

    return findSectionIndex
}


function renameSection(newName, sectionId) {
    if (typeof newName !== "string") return

    const findSectionIndex = findSectionIndexById(sectionId)
    if (findSectionIndex === false) return

    sectionsDb[findSectionIndex].name = newName
    console.log('renameTask => ', sectionsDb, sectionsDb[findSectionIndex])
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

function deleteSection(sectionId) {
    const findSectionIndex = findSectionIndexById(sectionId)
    if (findSectionIndex === false) return

    sectionsDb.splice(findSectionIndex, 1)

    tasksDb = tasksDb.filter(task => task.sectionId !== sectionId)
    console.log('deleteSection => ', sectionsDb)
}

// Others
function generateId() {
    const date = Date.now()
    const randomString = Math.random().toString(36).slice(2)

    return randomString + date
}

// -- frontEnd -- 

// createSection system
function addPreviewSection() {
    // mudar: outro template
    const sectionItemEditor = `
        <div class="section-editor">
            <div class="section-editor-input">
                <input type="text" class="input-field">
            </div>
            <div class="section-editor-footer">
                <input type="button" class="cancel-button default-button" value="cancel">
                <input type="button" class="add-button default-button" value="create">
            </div>
        </div>
    `

    const sectionList = document.querySelector('.project-board')
    sectionList.insertAdjacentHTML('beforeend', sectionItemEditor)

    const inputName = sectionList.querySelector('.input-field')

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
                    <span class="section-text">${sectionName}</span>
                </div>
            </div>
            <div class="task-list"></div>
            <div class="task-adder">
                <input type="button" class="add-task-button" value="Add task">
            </div>
            <div class="delete-section-content">
                    <input type="button" class="delete-section-button" value="del">
            </div>
        </div>
    `
    const sectionList = document.querySelector('.project-board')
    sectionList.insertAdjacentHTML('beforeend', newSection)
}

function handleEnterSectionName(event) {
    const input = event.target
    removeEventListeners(input)

    const sectionName = input.value.trim()

    const sectionList = input.closest('.project-board')
    const previewSection = sectionList.lastElementChild
    sectionList.removeChild(previewSection)

    if (!sectionName) return
    createSection(sectionName)
    updateProjectBoard() 
}


// createTask system:
function addPreviewTask(event) {
    const target = event.target
    const section = target.closest('.project-section')

    const taskItemEditor = `
        <div class="task-editor">
            <div class="task-editor-area">
                <div class="task-editor-input">
                    <input type="text" class="input-field" placeholder="Task name">
                </div>
                <div class="task-editor-buttons">
                    <input type="button" class="date-input" value="set date">
                    <input type="button" class="status-input" value="add status">
                </div>
            </div>
            <div class="task-editor-footer">
                <input type="button" class="cancel-button default-button" value="cancel">
                <input type="button" class="add-button default-button" value="create">
            </div>
        </div>
    `

    const taskList = section.querySelector('.task-list')
    taskList.insertAdjacentHTML('beforeend', taskItemEditor);

    const inputName = taskList.querySelector('.input-field')

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
                <div class="delete-task-content">
                    <input type="button" class="delete-task-button" value="del">
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
    updateProjectBoard()
}

 //-- update task --

// renameSection sustem
function showSectionRenameInput(event) {
    const target = event.target

    const renameInput = `
    <input type="text" class="input-field" placeholder="Task name">
    ` 

    target.insertAdjacentHTML('beforeend', renameInput)

    const sectionText = target.querySelector('.section-text')
    sectionText.style.display = 'none' // Mudar: Css

    const inputName = sectionText.nextElementSibling

    inputName.addEventListener('blur', handleRenameSection)
    inputName.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleRenameSection(event)
        }
    })

    inputName.focus()
}

function handleRenameSection(event) {
    const inputButton = event.target
    removeEventListeners(inputButton)

    const sectionName = inputButton.value.trim()
    const sectionId = inputButton.closest('.project-section').dataset.sectionid
    console.log(sectionId)

    const sectionList = inputButton.closest('.project-board')
    const renameInput = sectionList.lastElementChild
    sectionList.removeChild(renameInput)

    console.log('sectionName: ', sectionName)

    if (!sectionName) return
    renameSection(sectionName, sectionId)
    updateProjectBoard()
}

// renameTask system
function showTaskRenameInput(event) {
    const target = event.target
    console.log(target)
    
    const renameInput = `
        <input type="text" class="input-field" placeholder="Task name">
    `

    target.insertAdjacentHTML('beforeend', renameInput);
    
    const taskTitle = target.querySelector('.task-text')
    taskTitle.style.display = 'none' // Mudar: add em css

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
    const inputButton = event.target
    removeEventListeners(inputButton)

    const taskName = inputButton.value.trim()
    const taskId = inputButton.closest('.task').dataset.taskid
    console.log(taskId)

    const taskList = inputButton.closest('.task-list')
    const renameInput = taskList.lastElementChild
    console.log(renameInput)
    taskList.removeChild(renameInput)

    if (!taskName) return
    renameTask(taskName, taskId)
    updateProjectBoard()
}

// toggle task status
function toggleTaskItemStatus(event) {
    const target = event.target
    const taskId = target.closest('.task').dataset.taskid

    toggleTaskStatus(taskId)

    updateProjectBoard()
}


// deleteTask systemw
function deleteTaskItem(event) {
    const target = event.target
    const taskId = target.closest('.task').dataset.taskid

    if (!taskId) return

    deleteTask(taskId)
    updateProjectBoard()
}

// deleteSectiion system
function deleteSectionItem(event) {
    const target = event.target
    const sectionId  = target.closest('.project-section').dataset.sectionid

    if (!sectionId) return
    deleteSection(sectionId)
    updateProjectBoard()
}

// outros

function removeEventListeners(input) {
    input.removeEventListener('blur', handleEnterTaskName)
    input.removeEventListener('blur', handleRenameTask)
    input.removeEventListener('blur', handleEnterSectionName)
    input.removeEventListener('blur', handleRenameSection)
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
        showTaskRenameInput(event)
    }

    if (target.classList.contains('section-title')) {
        showSectionRenameInput(event)
    }
})

projectBoard.addEventListener('click', (event) => {
    const target = event.target

    if (target.classList.contains('add-task-button')) {
        addPreviewTask(event)
    }

    if (target.classList.contains('delete-task-button')) {
        deleteTaskItem(event)
    }

    if (target.classList.contains('task-checkbox')) {
        toggleTaskItemStatus(event)
    }

    if (target.classList.contains('delete-section-button')) {
        deleteSectionItem(event)
    }
})

const addSectionButton = document.querySelector('.add-section')
addSectionButton.addEventListener('click', addPreviewSection)


