import "./css/style.css";

const createTodoItem = function(title = "", description="", dueDate="", priority="", note="") {
    let itemTitle = title;
    let itemDescription = description;
    let itemDueDate = dueDate;
    let itemPriority = priority;
    let itemNote = note;

    const setTitle = (title) => {
        itemTitle = title;
    }

    const setDescription = (description) => {
        itemDescription = description;
    }

    const setDueDate = (dueDate) => {
        itemDueDate = dueDate;
    }

    const setPriority = (priority) => {
        itemPriority = priority;
    }

    const setNote = (note) => {
        itemNote = note;
    }

    const getTitle = () => itemTitle;
    const getDescription = () => itemDescription;
    const getDueDate = () => itemDueDate;
    const getPriority = () => itemPriority;
    const getNote = () => itemNote;

    return {
        setTitle, setDescription, setDueDate, setPriority, setNote,
        getTitle, getDescription, getDueDate, getPriority, getNote,
    };
};

const createListContainer = function() {
    let itemList = [];

    const addItemToList = (item) => {
        itemList.push(item);
    }

    const removeItemFromList = (item) => {
        const itemIndex = itemList.indexOf(item);
        itemList.splice(itemIndex, 1);
    }

    const getItemFromList = (itemIndex) => {
        return itemList[itemIndex];
    }

    const getItemList = () => itemList;

    return {
        addItemToList,
        removeItemFromList,
        getItemFromList,
        getItemList,
    };
}

const createProject = function(name) {
    let projectName = name;
    const itemList = createListContainer();

    const getName = () => projectName;
    return {
        addTodoItemFromList : itemList.addItemToList,
        removeTodoItemFromList : itemList.removeItemFromList,
        getTodoItemFromList : itemList.getItemFromList,
        getTodoItemList : itemList.getItemList,
        getName,
    };
}

const createWorkspace = function() {
    const itemList = createListContainer();
    return {
        addProjectToWorkspace : itemList.addItemToList,
        removeProjectFromWorkspace : itemList.removeItemFromList,
        getProjectFromWorkspace : itemList.getItemFromList,
        getWorkspace : itemList.getItemList,
    };
}

const ScreenController = function() {
    const workspace = createWorkspace();
    const projectsContainer = document.querySelector(".projects");
    const projectDialog = document.querySelector(".project-dialog");

    const deleteIcon = document.querySelector(".delete-icon");
    const deleteHoverIcon = document.querySelector(".delete-icon-hover");
    
    projectsContainer.addEventListener("click", () => {
        projectDialog.showModal();
    });

    const displayProjects = function() {
        clearProjects();

        workspace.forEach((project, index) => {
            const projectElement = document.createElement("button");
            projectElement.classList.add("project");
            projectElement.dataset.index = index;
            projectElement.textContent = project.getName();

            const deleteIconElement = deleteIcon.cloneNode(true);
    
            projectsContainer.appendChild(projectElement);
            projectsContainer.appendChild(deleteIconElement);
        });
    }

    const clearProjects = function() {
        projectsContainer.children.forEach(child => {
            projectsContainer.removeChild(child);
        });
    }
}

ScreenController();
/* 
Pseudo Code

    CREATE factory function for todoItem object
    CREATE factory function for project object 

    factory function (todoItem)
        CREATE properties: title, description, dueDate, priority, notes
        CREATE modifyTodoItem method
        GENERATE getters and setters for each property
        RETRUN getters and setters

    factory function (project)
        CREATE properties: todoItemList,
        GENERATE getter for todoItemList
        CREATE methods : addTodoItemToList, removeTodoItemFromList, getTodoItemFromList
*/
