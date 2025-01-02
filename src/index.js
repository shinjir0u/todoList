import "./css/style.css";

const createTodoItem = function(title = "", description="", dueDate="", priority="", note="") {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.note = note;

    const setTitle = (title) => {
        this.title = title;
    }

    const setDescription = (description) => {
        this.description = description;
    }

    const setDueDate = (dueDate) => {
        this.dueDate = dueDate;
    }

    const setPriority = (priority) => {
        this.priority = priority;
    }

    const setNote = (note) => {
        this.note = note;
    }

    const getTitle = () => this.title;
    const getDescription = () => this.description;
    const getDueDate = () => this.dueDate;
    const getPriority = () => this.priority;
    const getNote = () => this.note;

    return {
        setTitle, setDescription, setDueDate, setPriority, setNote,
        getTitle, getDescription, getDueDate, getPriority, getNote,
    };
};

const createListContainer = function() {
    this.itemList = [];

    const addItemToList = (item) => {
        this.itemList.push(item);
    }

    const removeItemFromList = (item) => {
        const itemIndex = this.itemList.indexOf(item);
        this.itemList.splice(itemIndex, 1);
    }

    const getItemFromList = (itemIndex) => {
        return this.itemList[itemIndex];
    }

    const getItemList = () => this.itemList;

    return {
        addItemToList,
        removeItemFromList,
        getItemFromList,
        getItemList,
    };
}

const createProject = function(name) {
    this.projectName = name;
    const itemList = createListContainer();

    const getName = () => this.projectName;
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
