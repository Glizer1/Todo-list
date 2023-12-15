

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
    { id: 'B', name: "Section 2", order: 2 },
    { id: 'C', name: "Section 3", order: 3 },
    { id: 'D', name: "Section 4", order: 4 },
]

// -drag and dropTaskItem system
// -create local storage system
// -style

// -- backEnd --
 
// CRUD:
function createSection(name) {
    if (typeof name !== 'string') return

    const sectionAmount = sectionsDb.length

    const createId = generateId()
    sectionsDb.push({ id: createId, name: name, order: sectionAmount +1})

    console.log('createSection => ', sectionsDb)
}

function createTask(name, sectionId) {
    if (typeof name !== "string") return

    const findSection = sectionsDb.find(section => sectionId === section.id)
    if (!findSection) return

    const sectionLength = tasksDb.filter(task => task.sectionId === sectionId).length

    const createId = generateId()
    tasksDb.push({ id: createId, name, state: '', sectionId, order: sectionLength + 1 })

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

function changeTaskPosition(newOrder, taskId, sectionId) {
    const findTaskIndex = findTaskIndexById(taskId)
    if (findTaskIndex === false) return

    const taskSelected = tasksDb[findTaskIndex]
        
    const filterByNewSection = tasksDb.filter(task => task.sectionId === sectionId && task.id !== taskId)
    console.log(filterByNewSection)
    if (sectionId === taskSelected.sectionId) {
        if (newOrder > taskSelected.order) {
            filterByNewSection.forEach(task => {
                if (task.order > newOrder || task.order < taskSelected.order) return
                task.order -= 1;
            });
        } else {
            filterByNewSection.forEach(task => {
                if (task.order < newOrder || task.order > taskSelected.order) return
                task.order += 1;
            });
        }
    }

    if (sectionId !== taskSelected.sectionId) {
        const filterByOriginSection = tasksDb.filter(task => task.sectionId === taskSelected.sectionId && task.id !== taskId)
        filterByOriginSection.forEach(task => {
            if (task.order <= taskSelected.order) return
            task.order -= 1;
        });

        filterByNewSection.forEach(task => {
            if (task.order < newOrder) return
            task.order += 1;
        });
    }

    taskSelected.order = newOrder;
    taskSelected.sectionId = sectionId;
    console.log(tasksDb)
}

function changeSectionPosition(newOrder, sectionId) {
    const findSectionIndex = findSectionIndexById(sectionId)
    if (findSectionIndex === false) return

    const sectionSelected = sectionsDb[findSectionIndex]
        
    console.log(sectionsDb)
    if (newOrder > sectionSelected.order) {
        sectionsDb.forEach(section => {
            if (section.id === sectionId) return
            if (section.order > newOrder || section.order < sectionSelected.order) return
            section.order -= 1;
        });
    } else {
        sectionsDb.forEach(section => {
            if (section.id === sectionId) return
            if (section.order < newOrder || section.order > sectionSelected.order) return
            section.order += 1;
        });
        }

    sectionSelected.order = newOrder;
    console.log(sectionsDb)
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

function createSectionItem(sectionName, sectionId, sectionOrder) {
    const newSection = `
        <div class="project-section" data-sectionId="${sectionId}" data-order="${sectionOrder}">
            <div class="section">
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
        </div>
    `
    const sectionList = document.querySelector('.section-list')
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
            <div class="box-item" data-order="${taskOrder}">
                <li class="task" data-taskId="${taskId}">
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
            </div>
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
    console.log(target)
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

// drag & dropTaskItem system
// -mousedown: dragTaskStart
// -mousemove: dragTask 
// -mouseenter/mouseover + mouseleave/mouseout (style)
// -mouseup: dropTaskItem

let draggedElement = null
let dragging = false
let initialX = 0
let initialY = 0

function moveDraggedElement(event) {
    draggedElement.style.top = `${event.pageY - initialY}px`
    draggedElement.style.left = `${event.pageX - initialX}px`
}

function getClosestElement(elementList, clientY) {
    let closestElement = null

    let index = 1
    for (const element of elementList) {
        const { bottom } = element.getBoundingClientRect()
        const offset = clientY - bottom

        const isLastElement = index === elementList.length
        if (offset < 0 || isLastElement) {
            closestElement = element
            break
        }
        index++
    }

    return closestElement
}

function removeDragState(dragFunction, dropfunciton) {
    document.body.classList.remove('dragging')

    if (draggedElement) {
        draggedElement.remove()
    }

    const draggingPreview = document.querySelector('.dragging-preview')
    if (draggingPreview) {
        draggingPreview.remove()
    }

    dragging = false
    draggedElement = null

    document.removeEventListener('wheel', moveDraggedElement)
    
    if (!dragFunction || !dropfunciton) return
    document.removeEventListener('mousemove', dragFunction)
    document.removeEventListener('mouseup', dropfunciton)
}

// dragAndDrop task

function dragTaskStart(event) {
    if (event.button !== 0) return
    
    const target = event.target
    const taskTarget = target.closest('.task')
    if (!taskTarget) return
    console.log('start')

    draggedElement = taskTarget.cloneNode(true)

    const rect = taskTarget.getBoundingClientRect()
    initialX = event.clientX - rect.left
    initialY = event.clientY - rect.top

    document.addEventListener('mousemove', dragTask)
    document.addEventListener('wheel', moveDraggedElement)
    }

function dragTask(event) {
    console.log('drag')
    if (event.buttons === 0) {
        removeDragState(dragTask, dropTaskItem)
        updateProjectBoard()
        return
    }

    document.addEventListener('mouseup', dropTaskItem)

    if (!dragging) {
        document.body.appendChild(draggedElement)
        document.body.classList.add('dragging')
        draggedElement.classList.add('dragged-element')

        const taskSelected = document.querySelector(`[data-taskId="${draggedElement.dataset.taskid}"]`)
        taskSelected.parentElement.classList.add('dragging-preview')
    }

    moveDraggedElement(event)
    dragging = true

    // dragging preview
    const sections = document.querySelectorAll('.project-section')
    const closestSection = getClosestElement(sections, event.clientY)

    const tasks = closestSection.querySelectorAll('.box-item')
    const closestTask = getClosestElement(tasks, event.clientY)

    if (!closestTask) return
    if (closestTask.classList.contains('dragging-preview')) return
    
    const draggingPreview = document.querySelector('.dragging-preview')

    const previousElement = closestTask.previousElementSibling
    const nextElement = closestTask.nextElementSibling
    
    const closestTaskRect = closestTask.getBoundingClientRect()
    const taskOffset = (event.clientY - closestTaskRect.bottom) / closestTaskRect.height
    const canUsePreviousOffset = taskOffset < 0.5 && !previousElement
    const canUseNextOffset = taskOffset >= 0.5 && !nextElement

    const isPreviousElementAPreview = previousElement !== null && previousElement.classList.contains('dragging-preview')
    const isNextElementAPreview = nextElement !== null && nextElement.classList.contains('dragging-preview') 
    
    if (canUsePreviousOffset || isNextElementAPreview) {
        closestTask.parentElement.insertBefore(draggingPreview, closestTask)
    } else if (canUseNextOffset || isPreviousElementAPreview) {
        closestTask.parentElement.insertBefore(draggingPreview, closestTask.nextElementSibling)
    }

    const boxItems = closestSection.querySelectorAll('.box-item')
    boxItems.forEach((item, index) => {
        item.setAttribute('data-order', index +1)
    })
}

function dropTaskItem(event) {
    console.log('drop')
    if (event.button !== 0) return

    const draggingPreview = document.querySelector('.dragging-preview')
    if (draggingPreview) {
        const sectionId = draggingPreview.closest('.project-section').dataset.sectionid
        const taskId = draggingPreview.firstElementChild.dataset.taskid
        const taskOrder = Number(draggingPreview.dataset.order)
        
        changeTaskPosition(taskOrder, taskId, sectionId)
    }
    
    removeDragState(dragTask, dropTaskItem)
    
    updateProjectBoard()
}

// DragAndDrop section

function dragSectionStart(event) {
    if (event.button !== 0) return

    const target = event.target
    const sectionTarget = target.closest('.section-header')
    if (!sectionTarget) return
    console.log('start')

    draggedElement = sectionTarget.cloneNode(true)
    const selectedSection = sectionTarget.closest('.project-section')
    draggedElement.setAttribute('data-sectionId', selectedSection.dataset.sectionid)

    const rect = sectionTarget.getBoundingClientRect()
    initialX = event.clientX - rect.left
    initialY = event.clientY - rect.top

    document.addEventListener('mousemove', dragSection)
    document.addEventListener('wheel', moveDraggedElement)
}

function dragSection(event) {
    console.log('drag')
    if (event.buttons === 0) {
        removeDragState(dragSection, dropSectionItem)
        updateProjectBoard()
        return
    }
    
    document.addEventListener('mouseup', dropSectionItem)
    
    if (!dragging) {
        document.body.appendChild(draggedElement)
        document.body.classList.add('dragging')
        draggedElement.classList.add('dragged-element')

        const sectionSelected = document.querySelector(`[data-sectionId="${draggedElement.dataset.sectionid}"]`)
        console.log(sectionSelected)
        sectionSelected.classList.add('dragging-preview')
    }

    moveDraggedElement(event)
    dragging = true

    // dragging preview
    const sections = document.querySelectorAll('.project-section')
    const closestSection = getClosestElement(sections, event.clientY)

    if (!closestSection) return
    if (closestSection.classList.contains('dragging-preview')) return

    // Arrumar section system drag and drop

    const draggingPreview = document.querySelector('.dragging-preview')

    const previousElement = closestSection.previousElementSibling
    const nextElement = closestSection.nextElementSibling

    const closestSectionRect = closestSection.getBoundingClientRect()
    const sectionOffset = (event.clientY - closestSectionRect.bottom) / closestSectionRect.height
    const canUsePreviousOffset = sectionOffset < 0.5 && !previousElement
    const canUseNextOffset = sectionOffset >= 0.5 && !nextElement

    const isPreviousElementAPreview = previousElement !== null && previousElement.classList.contains('dragging-preview')
    const isNextElementAPreview = nextElement !== null && nextElement.classList.contains('dragging-preview') 

    if (canUsePreviousOffset || isNextElementAPreview) {
        closestSection.parentElement.insertBefore(draggingPreview, closestSection)
    } else if (canUseNextOffset || isPreviousElementAPreview) {
        closestSection.parentElement.insertBefore(draggingPreview, closestSection.nextElementSibling)
    }

    const sectionItems = document.querySelectorAll('.project-section')
    sectionItems.forEach((item, index) => {
        item.setAttribute('data-order', index +1)
    })
}

function dropSectionItem(event) {
    console.log('drop')
    if (event.button !== 0) return

    const draggingPreview = document.querySelector('.dragging-preview')
    if (draggingPreview) {
        const sectionId = draggingPreview.closest('.project-section').dataset.sectionid
        const sectionOrder = Number(draggingPreview.dataset.order)

        changeSectionPosition(sectionOrder, sectionId)
    }

    removeDragState(dragSection, dropSectionItem)
    
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
    const sortedSections = Array.from(sectionsDb).sort((a, b) => a.order - b.order)
    sortedSections.forEach(section => createSectionItem(section.name, section.id, section.order))

    const sortedTasks = Array.from(tasksDb).sort((a, b) => a.order - b.order)
    sortedTasks.forEach(task => createTaskItem(task.name, task.state, task.id, task.order, task.sectionId))
}

updateProjectBoard()

//inputs
const projectBoard = document.querySelector('.project-board')
projectBoard.addEventListener('mousedown', dragTaskStart)
projectBoard.addEventListener('mousedown', dragSectionStart)

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
    console.log('click => ', target)

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


