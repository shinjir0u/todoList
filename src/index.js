import "./css/style.css";

const createTodoItem = function(title = "", description="", dueDate="", priority="", note="") {
    let itemTitle = title;
    let itemDescription = description;
    let itemDueDate = dueDate;
    let itemPriority = priority;
    let itemNote = note;

    const setTitle = (title) => {
        itemTitle = title;
    };

    const setDescription = (description) => {
        itemDescription = description;
    };

    const setDueDate = (dueDate) => {
        itemDueDate = dueDate;
    };

    const setPriority = (priority) => {
        itemPriority = priority;
    };

    const setNote = (note) => {
        itemNote = note;
    };

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

const createListContainerController = function() {
    let itemList = [];

    const addItemToList = (item) => {
        itemList.push(item);
    };

    const removeItemFromList = (itemIndex) => {
        itemList.splice(itemIndex, 1);
    };

    const getItemFromList = (itemIndex) => {
        return itemList[itemIndex];
    };

    const getItemList = () => itemList;

    return {
        addItemToList,
        removeItemFromList,
        getItemFromList,
        getItemList,
    };
}

const createProjectController = function(name) {
    let projectName = name;
    const itemList = createListContainerController();

    const getName = () => projectName;
    return {
        addTodoItemFromList : itemList.addItemToList,
        removeTodoItemFromList : itemList.removeItemFromList,
        getTodoItemFromList : itemList.getItemFromList,
        getTodoItemList : itemList.getItemList,
        getName,
    };
}

const createWorkspaceController = function() {
    const itemList = createListContainerController();
    return {
        addProjectToWorkspace : itemList.addItemToList,
        removeProjectFromWorkspace : itemList.removeItemFromList,
        getProjectFromWorkspace : itemList.getItemFromList,
        getWorkspace : itemList.getItemList,
    };
}

const ScreenController = function() {
    const workspaceController = createWorkspaceController();

    const projectAddIcon = document.querySelector(".project-add-icon");
    const projectsContainer = document.querySelector(".projects");

    const projectDialog = document.querySelector(".project-dialog");
    const projectAddButton = document.querySelector(".project-dialog-button");

    const todoItemsContainer = document.querySelector(".todo-items");

    const deleteIcon = document.querySelector(".delete-icon");
    const deleteHoverIcon = document.querySelector(".delete-icon-hover");

    const displayProjects = function() {
        clearProjects();

        workspaceController.getWorkspace().forEach((project, index) => {
            const projectElement = document.createElement("button");
            projectElement.classList.add("project");
            projectElement.dataset.index = index;
            projectElement.textContent = project.getName();

            const deleteIconElement = deleteIcon.cloneNode(true);
            deleteIconElement.classList.add("project-delete-icon");

            deleteIconElement.addEventListener("mouseenter", deleteIconHoverHandler);
    
            projectsContainer.appendChild(projectElement);
            projectsContainer.appendChild(deleteIconElement);
        });
    };

    const clearProjects = function() {
        Array.from(projectsContainer.children).forEach(child => {
            projectsContainer.removeChild(child);
        });
    };

    const displayItems = function(project) {
        changeHeading(project);

        project.forEach((item, index) => {
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("todo-item");

            const checkBoxElement = document.createElement("input");
            checkBoxElement.type = "checkbox";
            
            const itemTitleElement = document.createElement("p");
            itemTitleElement.classList.add("item-title");
            itemTitleElement.textContent = item.getTitle();

            const itemDueDateElement = document.createElement("p");
            itemDueDateElement.classList.add("item-due-date");
            itemDueDateElement.textContent = item.getDueDate();

            const itemDeleteIcon = deleteIcon.cloneNode(true);
            itemDeleteIcon.classList.add("item-delete-icon");

            itemContainer.appendChild(checkBoxElement);
            itemContainer.appendChild(itemTitleElement);
            itemContainer.appendChild(itemDueDateElement);
            itemContainer.appendChild(itemDeleteIcon);
        });
    };

    

    const changeHeading = function(project) {
        const headingElement = document.querySelector(".heading");
        headingElement.textContent = project.getName();
    }

    const projectAddHandler = function(event) {
        event.preventDefault();
        const inputField = event.target.parentElement.previousElementSibling;
        const projectName = inputField.value;

        if (projectName) {
            const newProject = createProjectController(projectName);

            workspaceController.addProjectToWorkspace(newProject);
        }
        displayProjects();
        projectDialog.close();
    };

    const deleteIconHoverHandler = function(event) {
        const deleteHoverIconElement = deleteHoverIcon.cloneNode(true);
        event.target.parentElement.replaceChild(deleteHoverIconElement, event.target);
        deleteHoverIconElement.classList.add("project-delete-icon");
        deleteHoverIconElement.addEventListener("click", deleteProjectHandler);
        deleteHoverIconElement.addEventListener("mouseleave", deleteIconNoHoverHandler);
    };

    const deleteIconNoHoverHandler = function(event) {
        const deleteIconNoHover = deleteIcon.cloneNode(true);
        event.target.parentElement.replaceChild(deleteIconNoHover, event.target);
        deleteIconNoHover.classList.add("project-delete-icon");
        deleteIconNoHover.addEventListener("mouseenter", deleteIconHoverHandler);
    };

    const deleteProjectHandler = function(event) {
        const projectElement = event.target.previousElementSibling;
        const projectIndex = projectElement.dataset.index;
        workspaceController.removeProjectFromWorkspace(projectIndex);
        displayProjects();
    };

    projectAddIcon.addEventListener("click", () => {
        projectDialog.showModal();
    });

    projectAddButton.addEventListener("click", projectAddHandler);
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
