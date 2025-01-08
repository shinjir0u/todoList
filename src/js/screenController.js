import {
  createTodoItem,
  createProject,
  createDefaultWorkspace,
  createWorkspace,
} from "./todoApplication";

const ScreenController = function DisplayInteractions() {
  const workspace = createWorkspace();
  const defaultWorkspace = createDefaultWorkspace();
  let currentProject = defaultWorkspace.getDefaultProject();
  const deleteIcon = document.querySelector(".delete-icon");
  const deleteHoverIcon = document.querySelector(".delete-icon-hover");

  const defaultProjectsElement = document.querySelector(".default-projects");
  const projectsElement = document.querySelector(".projects");
  const projectsContainerElement = document.querySelector(
    ".projects-container",
  );
  const projectAddIcon = document.querySelector(".project-add-icon");
  const projectAddButton = document.querySelector(".project-dialog-button");
  const projectDialog = document.querySelector(".project-dialog");

  const itemAddIcon = document.querySelector(".item-add-icon");
  const todoItemsContainerElement = document.querySelector(".todo-items");
  const itemDialog = document.querySelector(".item-dialog");
  const todoItemAddButton = document.querySelector(".item-dialog-button");

  const deleteIconNoHoverHandlerFactory =
    function GenerateDeleteIconNoHoverHandler(parentType) {
      return function handleIconNoHover(event) {
        const iconState = event.target.dataset.state;

        if (iconState === "hover") {
          const deleteIconElement = deleteIcon.cloneNode(true);
          event.target.parentElement.replaceChild(
            deleteIconElement,
            event.target,
          );
          deleteIconElement.classList.add(`${parentType}-delete-icon`);
          deleteIconElement.dataset.state = "default";

          // eslint-disable-next-line no-use-before-define
          const deleteIconHoverHandler = deleteIconHoverHandlerFactory(parentType);
          deleteIconElement.addEventListener("mouseenter", deleteIconHoverHandler);
        }
      };
    };

  const deleteIconHoverHandlerFactory = function GenerateDeleteIconHoverHandler(
    parentType,
  ) {
    return function handleIconHover(event) {
      const iconState = event.target.dataset.state;

      if (iconState === "default") {
        const deleteHoverIconElement = deleteHoverIcon.cloneNode(true);
        event.target.parentElement.replaceChild(
          deleteHoverIconElement,
          event.target,
        );
        deleteHoverIconElement.classList.add(`${parentType}-delete-icon`);
        deleteHoverIconElement.dataset.state = "hover";
        
        const deleteIconNoHoverHandler = deleteIconNoHoverHandlerFactory(parentType);
        deleteHoverIconElement.addEventListener("mouseleave", deleteIconNoHoverHandler);
      }
    };
  };

  const projectDeleteIconHoverHandler =
    deleteIconHoverHandlerFactory("project");
  const addProjectDeleteIconHover = function projectDeleteIconHoverEvent(iconElement) {
    iconElement.addEventListener(
      "mouseenter",
      projectDeleteIconHoverHandler,
    );
  };

  const todoItemDeleteIconHoverHandler = deleteIconHoverHandlerFactory("item");
  const addItemDeleteIconHover = function itemDeleteIconHoverEvent(iconElement) {
    iconElement.addEventListener(
      "mouseenter",
      todoItemDeleteIconHoverHandler,
    );
  };

  const updateProjects = function displayProjects() {
    projectsElement.textContent = "";

    workspace.getProjects().forEach((project, index) => {
      const projectElement = document.createElement("button");
      projectElement.classList.add("project");
      projectElement.dataset.index = index;
      projectElement.textContent = project.getProjectName();

      const deleteIconElement = deleteIcon.cloneNode(true);
      deleteIconElement.classList.add("project-delete-icon");
      deleteIconElement.dataset.state = "default";
      addProjectDeleteIconHover(deleteIconElement);

      projectsElement.appendChild(projectElement);
      projectsElement.appendChild(deleteIconElement);
    });
  };

  const updateDefaultProjects = function displayDefaultProjects() {
    defaultWorkspace.getDefaultProjects().forEach((project, index) => {
      const projectElement = document.createElement("button");
      projectElement.classList.add("project");
      projectElement.dataset.index = index;
      projectElement.textContent = project.getProjectName();

      defaultProjectsElement.appendChild(projectElement);
    });
  };

  const changeHeading = function changeTodoItemsHeading(project) {
    const headingElement = document.querySelector(".heading");
    headingElement.textContent = project.getProjectName();
  };

  const getInputFieldsInsideForm = function getValuesFromDialogForm(form) {
    return Array.from(form.children).filter(
      (child) =>
        child.nodeName === "INPUT" ||
        child.nodeName === "SELECT" ||
        child.nodeName === "TEXTAREA",
    );
  };

  const showItemDialog = function showDialogForAddingItems() {
    itemDialog.showModal();
  };

  const activateProjectAddIcon = function activateProjectAddIcon(iconElement) {
    iconElement.classList.remove("disabled");
    iconElement.addEventListener("click", showItemDialog);
  };

  const deactivateProjectAddIcon = function deactivateProjectAddIcon(
    iconElement,
  ) {
    iconElement.classList.add("disabled");
    iconElement.removeEventListener("click", showItemDialog);
  };

  const disableIconIfNeeded = function considerDiablingItemAddIcon(project) {
    const projectName = project.getProjectName();
    activateProjectAddIcon(itemAddIcon);
    itemAddIcon.style.cursor = "pointer";
    if (projectName === "COMPLETED") {
      deactivateProjectAddIcon(itemAddIcon);
      itemAddIcon.style.cursor = "default";
    }
  };

  const updateItems = function displayTodoItems(project) {
    todoItemsContainerElement.textContent = "";
    changeHeading(project);
    disableIconIfNeeded(project);

    project.getTodoItems().forEach((item, index) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("todo-item");
      itemContainer.dataset.index = index;

      const checkBoxLabel = document.createElement("label");
      checkBoxLabel.classList.add("checkbox-label");
      const checkBoxElement = document.createElement("input");
      checkBoxElement.type = "checkbox";
      checkBoxLabel.appendChild(checkBoxElement);

      const itemTitleElement = document.createElement("p");
      itemTitleElement.classList.add("item-title");
      itemTitleElement.textContent = item.getTitle();

      const itemDueDateElement = document.createElement("p");
      itemDueDateElement.classList.add("item-due-date");
      itemDueDateElement.textContent = item.getDueDate();

      const itemDeleteIcon = deleteIcon.cloneNode(true);
      itemDeleteIcon.classList.add("item-delete-icon");
      itemDeleteIcon.dataset.state = "default";
      addItemDeleteIconHover(itemDeleteIcon);

      todoItemsContainerElement.appendChild(itemContainer);
      itemContainer.appendChild(checkBoxLabel);
      itemContainer.appendChild(itemTitleElement);
      itemContainer.appendChild(itemDueDateElement);
      itemContainer.appendChild(itemDeleteIcon);
    });
  };

  const projectsClickHanlderFactory = function GenerateProjectsClickHander(
    workspaceType,
  ) {
    return function handleClick(event) {
      const projectIndex = Number(event.target.dataset.index);

      if (Number.isInteger(projectIndex)) {
        currentProject = workspaceType.getProject(projectIndex);
        updateItems(currentProject);
      }
    };
  };

  const defaultProjectsClickHandler =
    projectsClickHanlderFactory(defaultWorkspace);
  defaultProjectsElement.addEventListener("click", defaultProjectsClickHandler);
  const projectsClickHandler = projectsClickHanlderFactory(workspace);
  projectsElement.addEventListener("click", projectsClickHandler);

  const deleteProjectHandler = function delectProjectEvent(event) {
    const iconState = event.target.dataset.state;

    if (iconState) {
      const projectElement = event.target.previousElementSibling;
      const projectIndex = projectElement.dataset.index;
      workspace.removeProject(projectIndex);
      updateProjects();
    }
  };

  const deleteItemHandler = function deleteItemEvent(event) {
    const iconState = event.target.dataset.state;

    if (iconState) {
      const itemElement = event.target.parentElement;
      const itemIndex = itemElement.dataset.index;
      currentProject.removeTodoItem(itemIndex);
      updateItems(currentProject);
    }
  };

  projectsContainerElement.addEventListener("click", deleteProjectHandler);
  todoItemsContainerElement.addEventListener("click", deleteItemHandler);

  const projectAddHandler = function addNewProjectToWorkspace(event) {
    event.preventDefault();
    const inputField = event.target.parentElement.previousElementSibling;
    const projectName = inputField.value;

    if (projectName) {
      const newProject = createProject(projectName);

      workspace.addProject(newProject);
    }
    updateProjects();
    projectDialog.close();
  };

  const todoItemAddHandler = function addTodoItemToProject(event) {
    const todoItemForm = event.target.parentElement.parentElement;
    const inputItems = getInputFieldsInsideForm(todoItemForm);

    const [
      itemTitleValue,
      itemDescriptionValue,
      itemDueDateValue,
      itemPriorityValue,
      itemNoteValue,
    ] = inputItems.map((item) => item.value);

    const todoItem = createTodoItem({
      title: itemTitleValue,
      description: itemDescriptionValue,
      dueDate: itemDueDateValue,
      priority: itemPriorityValue,
      note: itemNoteValue,
    });
    currentProject.addTodoItem(todoItem);
    updateItems(currentProject);
  };

  projectAddButton.addEventListener("click", projectAddHandler);
  todoItemAddButton.addEventListener("click", todoItemAddHandler);

  const showProjectDialog = function displayProjectDialogBox() {
    projectDialog.showModal();
  };

  updateDefaultProjects();
  updateItems(currentProject);
  projectAddIcon.addEventListener("click", showProjectDialog);
  itemAddIcon.addEventListener("click", showItemDialog);
};

export default ScreenController;
