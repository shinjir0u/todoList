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

const createListContainer = function() {
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

const createProject = function(name) {
    let projectName = name;
    const itemList = createListContainer();

    const getProjectName = () => projectName;
    return {
        addTodoItemToProject : itemList.addItemToList,
        removeTodoItemFromProject : itemList.removeItemFromList,
        getTodoItemFromProject : itemList.getItemFromList,
        getTodoItems : itemList.getItemList,
        getProjectName,
    };
}

const createWorkspace = function() {
    const itemList = createListContainer();
    return {
        addProjectToWorkspace : itemList.addItemToList,
        removeProjectFromWorkspace : itemList.removeItemFromList,
        getProjectFromWorkspace : itemList.getItemFromList,
        getProjects : itemList.getItemList,
    };
}

const ScreenController = function() {
    const workspace = createWorkspace();
    let currentProject = "defaultProject"; 

    const projectAddIcon = document.querySelector(".project-add-icon");
    const projectsContainer = document.querySelector(".projects");
    const projectDialog = document.querySelector(".project-dialog");
    const projectAddButton = document.querySelector(".project-dialog-button");

    const todoItemsContainer = document.querySelector(".todo-items");
    const todoItemAddIcon = document.querySelector(".item-add-icon");
    const itemDialog = document.querySelector(".item-dialog");
    const todoItemAddButton = document.querySelector(".item-dialog-button");

    const deleteIcon = document.querySelector(".delete-icon");
    const deleteHoverIcon = document.querySelector(".delete-icon-hover");

    const displayProjects = function() {
        clearContainingElements(projectsContainer);

        workspace.getProjects().forEach((project, index) => {
            const projectElement = document.createElement("button");
            projectElement.classList.add("project");
            projectElement.dataset.index = index;
            projectElement.textContent = project.getProjectName();

            const deleteIconElement = deleteIcon.cloneNode(true);
            deleteIconElement.classList.add("project-delete-icon");

            projectElement.addEventListener("click", projectSelectHandler);
            deleteIconElement.addEventListener("mouseenter", projectDeleteIconHoverHandler);
    
            projectsContainer.appendChild(projectElement);
            projectsContainer.appendChild(deleteIconElement);
        });
    };

    const displayItems = function(project) {
        clearContainingElements(todoItemsContainer);
        changeHeading(project);

        project.getTodoItems().forEach((item, index) => {
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("todo-item");
            itemContainer.dataset.index = index;

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
            itemDeleteIcon.addEventListener("mouseenter", itemDeleteIconHoverHandler);

            todoItemsContainer.appendChild(itemContainer);
            itemContainer.appendChild(checkBoxElement);
            itemContainer.appendChild(itemTitleElement);
            itemContainer.appendChild(itemDueDateElement);
            itemContainer.appendChild(itemDeleteIcon);
        });
    };

    const changeHeading = function(project) {
        const headingElement = document.querySelector(".heading");
        headingElement.textContent = project.getProjectName();
    }

    const clearContainingElements = function(elementNode) {
        elementNode.textContent = "";
    }

    const projectAddHandler = function(event) {
        event.preventDefault();
        const inputField = event.target.parentElement.previousElementSibling;
        const projectName = inputField.value;

        if (projectName) {
            const newProject = createProject(projectName);

            workspace.addProjectToWorkspace(newProject);
        }
        displayProjects();
        projectDialog.close();
    };

    const projectDeleteIconHoverHandler = function(event) {
        const deleteHoverIconElement = deleteHoverIcon.cloneNode(true);
        event.target.parentElement.replaceChild(deleteHoverIconElement, event.target);
        deleteHoverIconElement.classList.add("project-delete-icon");
        deleteHoverIconElement.addEventListener("click", deleteProjectHandler);
        deleteHoverIconElement.addEventListener("mouseleave", projectDeleteIconNoHoverHandler);
    };

    const projectDeleteIconNoHoverHandler = function(event) {
        const deleteIconNoHover = deleteIcon.cloneNode(true);
        event.target.parentElement.replaceChild(deleteIconNoHover, event.target);
        deleteIconNoHover.classList.add("project-delete-icon");
        deleteIconNoHover.addEventListener("mouseenter", projectDeleteIconHoverHandler);
    };

    const projectSelectHandler = function(event) {
        const projectIndex = event.target.dataset.index;
        currentProject = workspace.getProjectFromWorkspace(projectIndex);
        displayItems(currentProject);
    };

    const deleteProjectHandler = function(event) {
        const projectElement = event.target.previousElementSibling;
        const projectIndex = projectElement.dataset.index;
        workspace.removeProjectFromWorkspace(projectIndex);
        displayProjects();
    };

    const itemDeleteIconHoverHandler = function(event) {
        const deleteHoverIconElement = deleteHoverIcon.cloneNode(true);
        event.target.parentElement.replaceChild(deleteHoverIconElement, event.target);
        deleteHoverIconElement.classList.add("item-delete-icon");
        deleteHoverIconElement.addEventListener("click", deleteItemHandler);
        deleteHoverIconElement.addEventListener("mouseleave", itemDeleteIconNoHoverHandler);
    }

    const itemDeleteIconNoHoverHandler = function(event) {
        const deleteIconNoHover = deleteIcon.cloneNode(true);
        event.target.parentElement.replaceChild(deleteIconNoHover, event.target);
        deleteIconNoHover.classList.add("item-delete-icon");
        deleteIconNoHover.addEventListener("mouseenter", itemDeleteIconHoverHandler);
    }

    const deleteItemHandler = function(event) {
        const itemElement = event.target.parentElement;
        const itemIndex = itemElement.dataset.index;
        currentProject.removeTodoItemFromProject(itemIndex);
        displayItems(currentProject);
    }

    const todoItemAddHandler = function(event) {
        const todoItemForm = event.target.parentElement.parentElement;
        const inputItems = getInputFieldsInsideForm(todoItemForm);

        const [ itemTitleValue, itemDescriptionValue, itemDueDateValue, itemPriorityValue ] = inputItems.map(item => item.value);
        
        const todoItem = createTodoItem(itemTitleValue, itemDescriptionValue, 
                            itemDueDateValue, itemPriorityValue);
        currentProject.addTodoItemToProject(todoItem);
        displayItems(currentProject);
    }

    const getInputFieldsInsideForm = function(form) {
        return Array.from(form.children).filter(child => child.nodeName === "INPUT" 
                                        | child.nodeName==="SELECT" 
                                        | child.nodeName==="TEXTAREA");
    }

    projectAddIcon.addEventListener("click", () => {
        projectDialog.showModal();
    });

    projectAddButton.addEventListener("click", projectAddHandler);

    todoItemAddIcon.addEventListener("click", () => {
        itemDialog.showModal();
    });

    todoItemAddButton.addEventListener("click", todoItemAddHandler);
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
