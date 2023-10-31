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
    let findTaskIndex;
    for (const section of projectDB) {
        findTaskIndex = section.taskList.findIndex(task => task.id === taskId)

        if (findTaskIndex !== -1) return [section, findTaskIndexById]
    }
    return false
}

function renameTask(newName, taskId) {
    const findTaskIndex = findTaskById(taskId)
    if (!findIndex) return

    console.log(findIndex[0], findIndex[1])
}

function toggleChekedState(isChecked, taskId) {
    
}


function deleteTask(taskId) {
    for (const section of projectDB) {
        const findTaskIndex = section.taskList.findIndex(task => task.id === taskId)

        if (findTaskIndex !== -1) {
            section.taskList.splice(findTaskIndex, 1)
            break
        }
    }
}

// Others
function generateId() {
    const date = Date.now()
    const randomString = Math.random().toString(36).slice(2)

    return randomString + date
}
