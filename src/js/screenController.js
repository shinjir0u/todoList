import { createTodoItem, createProject, createDefaultWorkspace, createWorkspace } from "./todoApplication";

const ScreenController = function() {
    const workspace = createWorkspace();
    const defaultWorkspace = createDefaultWorkspace();
    let currentProject = defaultWorkspace.getDefaultProject(); 

    const projectAddIcon = document.querySelector(".project-add-icon");
    const projectsContainer = document.querySelector(".projects");
    const projectDialog = document.querySelector(".project-dialog");
    const projectAddButton = document.querySelector(".project-dialog-button");

    const defaultProjectsContainer = document.querySelector(".default-projects");

    const todoItemsContainer = document.querySelector(".todo-items");
    const todoItemAddIcon = document.querySelector(".item-add-icon");
    const itemDialog = document.querySelector(".item-dialog");
    const todoItemAddButton = document.querySelector(".item-dialog-button");

    const deleteIcon = document.querySelector(".delete-icon");
    const deleteHoverIcon = document.querySelector(".delete-icon-hover");

    const displayDefaultProjects = function() {
        defaultWorkspace.getDefaultProjects().forEach((project, index) => {
            const projectElement = document.createElement("button");
            projectElement.classList.add("project");
            projectElement.dataset.index = index;
            projectElement.textContent = project.getProjectName();

            projectElement.addEventListener("click", defaultProjectSelectHandler);
            
            defaultProjectsContainer.appendChild(projectElement);
        });
    };

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
            deleteIconElement.addEventListener("mouseenter", deleteIconHoverHandler);
    
            projectsContainer.appendChild(projectElement);
            projectsContainer.appendChild(deleteIconElement);
        });
    };

    const displayItems = function(project) {
        clearContainingElements(todoItemsContainer);
        changeHeading(project);
        disableIconIfNeeded(project);

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
            itemDeleteIcon.addEventListener("mouseenter", deleteIconHoverHandler);

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

    const disableIconIfNeeded = function (project) {
        const projectName = project.getProjectName();
        todoItemAddIcon.classList.remove("disabled");
        todoItemAddIcon.addEventListener("click", showItemDialog);
        if (projectName === "COMPLETED") {
            todoItemAddIcon.classList.add("disabled");
            todoItemAddIcon.removeEventListener("click", showItemDialog);
        }
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

    const deleteIconHoverHandler = function(event) {
        const deleteHoverIconElement = deleteHoverIcon.cloneNode(true);
        const previousElementNodeName = event.target.previousElementSibling.nodeName;
        event.target.parentElement.replaceChild(deleteHoverIconElement, event.target);

        if (previousElementNodeName === "BUTTON") {
            deleteHoverIconElement.classList.add("project-delete-icon");
            deleteHoverIconElement.addEventListener("click", deleteProjectHandler);
        }
        else if (previousElementNodeName === "P") {
            deleteHoverIconElement.classList.add("item-delete-icon");
            deleteHoverIconElement.addEventListener("click", deleteItemHandler);
        }
        deleteHoverIconElement.addEventListener("mouseleave", deleteIconNoHoverHander);
    };

    const deleteIconNoHoverHander = function(event) {
        const deleteIconNoHover = deleteIcon.cloneNode(true);
        const previousElementNodeName = event.target.previousElementSibling.nodeName;
        event.target.parentElement.replaceChild(deleteIconNoHover, event.target);
        if (previousElementNodeName === "BUTTON") {
            deleteIconNoHover.classList.add("project-delete-icon");
        }
        else if (previousElementNodeName === "P") {
            deleteIconNoHover.classList.add("item-delete-icon");
        }
        deleteIconNoHover.addEventListener("mouseenter", deleteIconHoverHandler);
    };  

    const projectSelectHandler = function(event) {
        const projectIndex = event.target.dataset.index;
        currentProject = workspace.getProjectFromWorkspace(projectIndex);
        displayItems(currentProject);
    };

    const defaultProjectSelectHandler = function(event) {
        const projectIndex = event.target.dataset.index;
        currentProject = defaultWorkspace.getProjectFromDefaultWorkspace(projectIndex);
        displayItems(currentProject);
    }

    const deleteProjectHandler = function(event) {
        const projectElement = event.target.previousElementSibling;
        const projectIndex = projectElement.dataset.index;
        workspace.removeProjectFromWorkspace(projectIndex);
        displayProjects();
    };

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

    const showProjectDialog = function () {
        projectDialog.showModal();
    }

    const showItemDialog = function () {
        itemDialog.showModal();
    }

    const getInputFieldsInsideForm = function(form) {
        return Array.from(form.children).filter(child => child.nodeName === "INPUT" 
                                        | child.nodeName==="SELECT" 
                                        | child.nodeName==="TEXTAREA");
    }

    displayDefaultProjects();
    displayItems(currentProject);

    projectAddIcon.addEventListener("click", showProjectDialog);

    projectAddButton.addEventListener("click", projectAddHandler);

    todoItemAddIcon.addEventListener("click", showItemDialog);

    todoItemAddButton.addEventListener("click", todoItemAddHandler);
}

export default ScreenController;