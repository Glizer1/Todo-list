let tasksDb = [
    { id: 'A', name: "Task 1", state: '', sectionId: 'A', order: 1 },
    { id: 'B', name: "Task 2", state: 'checked', sectionId: 'A', order: 2 },
    { id: 'C', name: "Task 3", state: '', sectionId: 'A', order: 3 },
    { id: 'D', name: "Task 4", state: '', sectionId: 'A', order: 4 },
    { id: 'E', name: "Task 5", state: 'checked', sectionId: 'A', order: 5 },
    { id: 'F', name: "Task 6", state: '', sectionId: 'B', order: 1 },
    { id: 'G', name: "Task 7", state: 'checked', sectionId: 'B', order: 2 },
    { id: 'H', name: "Task 8", state: '', sectionId: 'B', order: 3 }
]

let sectionsDb = [
    { id: 'A', name: "Section 1", order: 1 },
    { id: 'B', name: "Section 2", order: 2 }
]

// -drag and drop system
// -create local storage system
// -style

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
    tasksDb.push({ id: createId, name, state: '', sectionId })

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

function toggleTaskState(taskId) {    
    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    tasksDb[findTaskIndex].state = tasksDb[findTaskIndex].state === '' ? 'checked' : ''
    console.log("toggleTaskState => ", tasksDb[findTaskIndex])
}

function changeItemPosition(newOrder, taskId, sectionId) {
    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    const taskSelected = tasksDb[findTaskIndex]
        
    const filterBySection = tasksDb.filter(task => task.sectionId === sectionId && task.id !== taskId)
    if (newOrder > taskSelected.order) {
        filterBySection.forEach(task => {
            if (task.order > newOrder) return
            task.order -= 1;
        });
    } else {
        filterBySection.forEach(task => {
            if (task.order < newOrder || task.order >= taskSelected.order) return
            task.order += 1;
        });
    }

    if (sectionId !== taskSelected.sectionId) {
        const filterByOriginSection = tasksDb.filter(task => task.sectionId === taskSelected.sectionId && task.id !== taskId)
        filterByOriginSection.forEach(task => {
            if (task.order <= taskSelected.order) return
            task.order -= 1;
        });   
    }

    taskSelected.order = newOrder;
    taskSelected.sectionId = sectionId;
    console.log(tasksDb)
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
function createHTMLelement(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()

    return div.firstElementChild
}

function addPreviewSection() {
    const isPreviewActive = document.querySelector('.section-editor')
    if (isPreviewActive) return

    const sectionItemEditor = `
        <div class="section-editor">
            <div class="section-editor-input">
                <!-- <input type="text" class="input-field" placeholder="Section name"> -->
                <input class="input-field" placeholder="Section Name">
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
    inputName.focus()

    const sectionEditor = document.querySelector('.section-editor')
    setSectionEditorEventListeners(sectionEditor)
}

function createSectionItem(sectionName, sectionId) {
    const newSection = `
        <div class="project-section" data-sectionId="${sectionId}">
            <div class="section-header">
                <div class="section-title">
                    <span class="section-text">${sectionName}</span>
                </div>
                <div class="delete-section-content">
                    <button type="button" class="delete-section-button default-button">
                        <span class="text-button">Delete</span>
                    </button>
                </div>
            </div>
            <div class="section-inner-content">
                <ul class="task-list"></ul>
                <div class="task-adder">
                    <button type="button" class="add-task-button default-button">
                        <span class="text-button">Add task</span>
                    </button>
                </div>
            </div>
        </div>
    `
    const sectionList = document.querySelector('.sections-list')
    sectionList.insertAdjacentHTML('beforeend', newSection)
}

function setSectionEditorEventListeners(sectionEditor) {
    sectionEditor.querySelector('.cancel-button').addEventListener('click', (event) => {
        removeSectionEditor(sectionEditor)
    })

    sectionEditor.querySelector('.add-button').addEventListener('click', (event) => {
        handleEnterSectionName(sectionEditor)
    })

    sectionEditor.querySelector('.input-field').addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return
        handleEnterSectionName(sectionEditor)
    })
}

function handleEnterSectionName(sectionEditor) {
    const inputField = sectionEditor.querySelector('.input-field')

    const sectionName = inputField.value.trim()

    removeSectionEditor(sectionEditor)

    if (!sectionName) return
    createSection(sectionName)
    updateProjectBoard() 
}

function removeSectionEditor(sectionEditor) {
    const sectionList = sectionEditor.closest('.project-board')
    const previewSection = sectionList.querySelector('.section-editor')
    sectionList.removeChild(previewSection)
}


// createTask system:
function addPreviewTask(event) {
    const oldTaskEditor = document.querySelector('.task-editor')
    if (oldTaskEditor) return

    const target = event.target
    const section = target.closest('.project-section')

    // remove all taskAdders
    const allTaskAdders = document.querySelectorAll('.task-adder')
    allTaskAdders.forEach(element => element.remove())

    let taskEditorHTMLString = `
        <div class="task-editor">
            <div class="task-editor-area">
                <div class="task-editor-input">
                    <input class="input-field" placeholder="Task name">
                </div>
            </div>
            <div class="task-editor-footer">
                <button type="button" class="cancel-button default-button">
                    <span class="text-button">Cancel</span>
                </button>
                <button type="button" class="add-button default-button">
                    <span class="text-button">Add task</span>
                </button>
            </div>
        </div>
    `
    const taskItemEditor = createHTMLelement(taskEditorHTMLString)

    const sectionInnerContent = section.querySelector('.section-inner-content')
    sectionInnerContent.appendChild(taskItemEditor)

    const inputField = sectionInnerContent.querySelector('.input-field')
    inputField.focus()
    
    const taskEditor = document.querySelector('.task-editor')
    setTaskEditorEventListeners(taskEditor)
}

function createTaskItem(taskName, taskState, taskId, taskOrder, sectionId) {
        const newTask = `
            <li class="task" data-taskId="${taskId}" data-order="${taskOrder}">
                <input type="checkbox" class="task-checkbox" ${taskState}>
                <div class="task-title">
                    <span class="task-text">${taskName}</span>
                </div>
                <div class="task-tools">
                    <div class="delete-task-content">
                        <button type="button" class="delete-task-button default-button">
                            <span class="text-button">Delete</span>
                        </button>
                    </div>
                </div>
            </li>
        `

        const section = document.querySelector(`[data-sectionId="${sectionId}"]`)
        const taskList = section.querySelector('.task-list')
    
        taskList.insertAdjacentHTML('beforeend', newTask);
}

function setTaskEditorEventListeners(taskEditor) {
    taskEditor.querySelector('.cancel-button').addEventListener('click', () => {
        removeTaskEditor(taskEditor)
    })

    taskEditor.querySelector('.add-button').addEventListener('click', () => {
        handleEnterTaskName(taskEditor) 
    })

    taskEditor.querySelector('.input-field').addEventListener('keydown', (event) => {    
        if (!taskEditor.querySelector('.input-field').textContent && event.key === "Backspace") {
            event.preventDefault()
        }
        // console.log(taskEditor, event, event.key)
        if (event.key !== 'Enter') return
        handleEnterTaskName(taskEditor)
    })
}

function handleEnterTaskName(taskEditor) {
    const inputField = taskEditor.querySelector('.input-field')
    
    const taskName = inputField.value.trim()
    const sectionId = inputField.closest('.project-section').dataset.sectionid

    removeTaskEditor(taskEditor)

    if (!taskName) return
    createTask(taskName, sectionId)
    updateProjectBoard()
}

function removeTaskEditor(taskEditor) {
    const sectionInnerContent = taskEditor.closest('.section-inner-content')
    const previewTask = sectionInnerContent.querySelector('.task-editor')
    sectionInnerContent.removeChild(previewTask)

    showTaskAdders()
}

function showTaskAdders() {
    const taskAdderTemplate = `
        <div class="task-adder">
            <button type="button" class="add-task-button default-button">
                <span class="text-button">Add task</span>
            </button>
        </div>
    `
    const allInnerContentSections = document.querySelectorAll('.section-inner-content')
    console.log(allInnerContentSections)
    allInnerContentSections.forEach(element => {
        element.insertAdjacentHTML('beforeend', taskAdderTemplate)
    })
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
    const inputField = event.target
    removeEventListeners(inputField)

    const sectionName = inputField.value.trim()
    const sectionId = inputField.closest('.project-section').dataset.sectionid

    inputField.previousElementSibling.style.display = 'block' // Mudar: css
    inputField.remove()

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
    const inputField = event.target
    removeEventListeners(inputField)

    const taskName = inputField.value.trim()
    const taskId = inputField.closest('.task').dataset.taskid

    inputField.previousElementSibling.style.display = 'block' // Mudar: css
    inputField.remove()

    if (!taskName) return
    renameTask(taskName, taskId)
    updateProjectBoard()
}

// toggle task state
function toggleTaskItemState(event) {
    const target = event.target
    const taskId = target.closest('.task').dataset.taskid

    toggleTaskState(taskId)

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

// drag & drop system
// -mousedown: dragStart
// -mousemove: onDrag 
// -mouseenter/mouseover + mouseleave/mouseout (style)
// -mouseup: drop

let draggedElement = null
let dragging = false
let initialX = 0
let initialY = 0

function dragStart(event) {
    const target = event.target
    const taskTarget = target.closest('.task')

    if (!taskTarget) return
    // draggedElement = taskTarget
    draggedElement = taskTarget.cloneNode(true)
    console.log(taskTarget)
    const rect = taskTarget.getBoundingClientRect()
    initialX = event.clientX - rect.left
    initialY = event.clientY - rect.top

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', drop)
}

function onDrag(event) {
    const target = event.target

    if (!target) return
    const taskList = target.closest('.task-list')
    if (!dragging) {
        document.body.appendChild(draggedElement)
        document.body.classList.add('dragging')
        draggedElement.classList.add('dragged-element')

        const div = document.createElement('div')
        div.setAttribute('class', 'dragging-preview')
        console.log(draggedElement.dataset.taskid)
        const taskSelected = taskList.querySelector(`[data-taskId="${draggedElement.dataset.taskid}"]`)
        console.log(taskSelected)

        taskList.replaceChild(div, taskSelected)

        // taskTarget.insertAdjacentElement('beforebegin', div)
    }
    draggedElement.style.left = event.clientX - initialX + "px"
    draggedElement.style.top =  event.clientY - initialY + "px"
    dragging = true

    const taskTarget = target.closest('.task-list .task')
    if (!taskTarget) return
    const draggingPreview = document.querySelector('.dragging-preview')
    const previousElement = taskTarget.previousElementSibling

    if (previousElement === null || !previousElement.classList.contains('dragging-preview')) {
        taskList.insertBefore(draggingPreview, taskTarget)
    } else {
        taskList.insertBefore(draggingPreview, taskTarget.nextElementSibling)
    }

    // const rect = taskTarget.getBoundingClientRect()
    // const offsetY = event.clientY - rect.top
    // const percentage = offsetY / rect.height

    // const draggingPreview = document.querySelector('.dragging-preview')
    // // console.log(draggingPreview)
    // if (draggingPreview) {
    //     draggingPreview.remove()
    // }
    // const div = document.createElement('div')
    // div.setAttribute('class', 'dragging-preview')
    // // console.log('taskTarget: ', taskTarget)
    // if (percentage <= 0.5) {
    //     taskTarget.insertAdjacentElement('beforebegin', div)

    // } else {
    //     taskTarget.insertAdjacentElement('afterend', div)
    // }
    // console.log('dragging: ', rect, offsetY, percentage)
}

function drop(event) {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', drop)
    const draggingPreview = document.querySelector('.dragging-preview')

    const target = event.target
    const taskTarget = target.closest('.task-list .task') || target.closest('.task-list .dragging-preview')
    if (taskTarget) {
        const sectionId = taskTarget.closest('.project-section').dataset.sectionid
        const taskId = draggedElement.dataset.taskid
        
        const next = draggingPreview.nextElementSibling || draggingPreview.previousElementSibling
        console.log(draggingPreview.nextElementSibling, next)
        const targetOrder = Number(next.dataset.order)
        console.log(targetOrder)


        changeItemPosition(targetOrder, taskId, sectionId)
    }

    if (draggedElement) {
        console.log(draggedElement)
        // document.body.removeChild(draggedElement)
        draggedElement.remove()
    }

    if (draggingPreview) {
        draggingPreview.remove()
    }

    dragging = false
    draggedElement = null
    
    updateProjectBoard()
}

// outros

function removeEventListeners(input) {
    input.removeEventListener('blur', handleRenameTask)
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
    const sortedTasks = Array.from(tasksDb).sort((a, b) => a.order - b.order)
    console.log(sortedTasks, tasksDb)
    sortedTasks.forEach(task => createTaskItem(task.name, task.state, task.id, task.order, task.sectionId))
}

updateProjectBoard()

//inputs
const projectBoard = document.querySelector('.project-board')
projectBoard.addEventListener('mousedown', dragStart)

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
        toggleTaskItemState(event)
    }

    if (target.classList.contains('delete-section-button')) {
        deleteSectionItem(event)
    }
})

const addSectionButton = document.querySelector('.add-section')
addSectionButton.addEventListener('click', addPreviewSection)


