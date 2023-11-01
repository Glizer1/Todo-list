let tasksDb = [
    { id: 0, name: "Task 1", checked: true, sectionId: 0 },
    { id: 1, name: "Task 2", checked: false, sectionId: 0 },
    { id: 2, name: "Task 1", checked: false, sectionId: 1 }
]

let sectionsDb = [
    { id: 0, sectionName: "Section 1" },
    { id: 1, sectionName: "Section 2" }
]

// back-end
/**
 - createTask
 - renameTask
 - toggleChekedState
 - deleteTask
 - generateId
 */

 
// CRUD:

function createTask(name, sectionId) {
    const findSection = sectionsDb.find(section => sectionId === section.id)
    if (!findSection) return

    const createId = generateId()
    tasksDb.push({ id: createId, name, checked: false, sectionId })

    console.log(tasksDb)
}

function findTaskIndexById(taskId) {
    const findTaskIndex = tasksDb.findIndex(task => taskId === task.id)
    if (!findTaskIndex) return

    return findTaskIndex
}

function renameTask(newName, taskId) {
    const findTaskIndex = findTaskIndexById(taskId)
    if (!findIndex) return

    console.log(findIndex[0], findIndex[1])
}

function toggleChekedState(isChecked, taskId) {
    
}


function deleteTask(taskId) {
    const findTaskIndex = findTaskIndexById(taskId)
    console.log(findTaskIndex)
    if (!findTaskIndex) return

    tasksDb.splice(findTaskIndex, 1)
    console.log(tasksDb)
}

// Others
function generateId() {
    const date = Date.now()
    const randomString = Math.random().toString(36).slice(2)

    return randomString + date
}
