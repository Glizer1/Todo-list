
let tasksDb = [
    { id: 0, name: "Task 1", checked: false, sectionId: 0 },
    { id: 1, name: "Task 2", checked: true, sectionId: 0 },
    { id: 2, name: "Task 1", checked: false, sectionId: 1 }
]

let sectionsDb = [
    { id: 0, sectionName: "Section 1" },
    { id: 1, sectionName: "Section 2" }
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

function addTask(event) {
    console.log(event)

    const taskPreviewTemplate = `
        <div class="task">
            <input type="checkbox" class="task-checkbox">
            <div class="task-title">
                <span class="task-text"></span>
                <input type="text" class="task-name-input" placeholder="Task name">
            </div>
        </div>
    `
    const target = event.target
    const taskList = target.parentElement.previousElementSibling
    
    taskList.insertAdjacentHTML('beforeend', taskPreviewTemplate);

    const input = taskList.lastElementChild.querySelector('.task-name-input')
    console.log(input)
    input.focus()
}

const addTaskButton = document.querySelectorAll('.add-task-button')
addTaskButton.forEach(button => {
    button.addEventListener('click', addTask)
})