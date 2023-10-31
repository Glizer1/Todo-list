let projectDB = [
    { sectionId: 0, sectionName: "Section 1", taskList: [
        { id: 0, name: "Task 1", checked: true },
        { id: 1, name: "Task 2", checked: false }
    ] },
    { sectionId: 1, sectionName: "Section 2", taskList: [
        { id: 2, name: "Task 1", checked: false },
    ] }
]

// back-end
/**
 - CreateTask
 - updateTask
 - deleteTask
 - generateId
 */

 
// CRUD:

function createTask(name, sectionId) {
    const findSection = projectDB.find(section => sectionId === section.sectionId)
    if (!findSection) return

    const createId = generateId()
    findSection.taskList.push({ id: createId, name, checked: false })

    console.log(findSection)
}

function updateTask() {

}

function deleteTask() {

}

// Others
function generateId() {
    const date = Date.now()
    const randomString = Math.random().toString(36).slice(2)

    return randomString + date
}
