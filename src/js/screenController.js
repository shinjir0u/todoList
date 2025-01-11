import { format, differenceInCalendarDays } from "date-fns";
import {
  createTodoItem,
  createProject,
  createDefaultWorkspace,
  createWorkspace,
} from "./todoApplication";

const ScreenController = function DisplayInteractions() {
  const workspace = createWorkspace();
  const defaultWorkspace = createDefaultWorkspace();
  const defaultProject = defaultWorkspace.getDefaultProject();
  const completedProject = defaultWorkspace.getCompletedProject();
  let currentProject = defaultProject;

  const deleteIcon = document.querySelector(".delete-icon");
  const deleteHoverIcon = document.querySelector(".delete-icon-hover");

  const defaultProjectsElement = document.querySelector(".default-projects");
  const projectsElement = document.querySelector(".projects");
  const projectAddIcon = document.querySelector(".project-add-icon");
  const projectAddButton = document.querySelector(".project-add-button");
  const projectCancelButton = document.querySelector(".project-cancel-button");
  const projectDialog = document.querySelector(".project-dialog");
  const projectDialogForm = document.querySelector(".project-add-form");

  const itemAddIcon = document.querySelector(".item-add-icon");
  const todoItemsContainerElement = document.querySelector(".todo-items");
  const todoItemAddButton = document.querySelector(".item-add-button");
  const todoItemCancelButton = document.querySelector(".item-cancel-button");
  const itemDialog = document.querySelector(".item-dialog");
  const itemDialogForm = document.querySelector(".item-add-form");

  const deleteIconNoHoverHandlerFactory =
    function GenerateDeleteIconNoHoverHandler(parentType) {
      return function handleIconNoHover(event) {
        const deleteIconElement = deleteIcon.cloneNode(true);
        event.target.parentElement.replaceChild(
          deleteIconElement,
          event.target,
        );
        deleteIconElement.classList.add(`${parentType}-delete-icon`);

        const deleteIconHoverHandler =
          // eslint-disable-next-line no-use-before-define
          deleteIconHoverHandlerFactory(parentType);
        deleteIconElement.addEventListener(
          "mouseenter",
          deleteIconHoverHandler,
        );
      };
    };

  const deleteIconHoverHandlerFactory = function GenerateDeleteIconHoverHandler(
    parentType,
  ) {
    return function handleIconHover(event) {
      const deleteHoverIconElement = deleteHoverIcon.cloneNode(true);
      event.target.parentElement.replaceChild(
        deleteHoverIconElement,
        event.target,
      );
      deleteHoverIconElement.classList.add(`${parentType}-delete-icon`);

      const deleteIconNoHoverHandler =
        deleteIconNoHoverHandlerFactory(parentType);
      deleteHoverIconElement.addEventListener(
        "mouseleave",
        deleteIconNoHoverHandler,
      );
      deleteHoverIconElement.style.cursor = "pointer";

      let callBackFunction;
      if (parentType === "project") {
        // eslint-disable-next-line no-use-before-define
        callBackFunction = deleteProjectHandler;
        // eslint-disable-next-line no-use-before-define
      } else if (parentType === "item") callBackFunction = deleteItemHandler;
      deleteHoverIconElement.addEventListener("click", callBackFunction);
    };
  };

  const projectDeleteIconHoverHandler =
    deleteIconHoverHandlerFactory("project");
  const addProjectDeleteIconHover = function projectDeleteIconHoverEvent(
    iconElement,
  ) {
    iconElement.addEventListener("mouseenter", projectDeleteIconHoverHandler);
  };

  const todoItemDeleteIconHoverHandler = deleteIconHoverHandlerFactory("item");
  const addItemDeleteIconHover = function itemDeleteIconHoverEvent(
    iconElement,
  ) {
    iconElement.addEventListener("mouseenter", todoItemDeleteIconHoverHandler);
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

  const activateItemDeleteIcons = function activateItemDeleteIcons(
    deleteIcons,
  ) {
    deleteIcons.forEach((deleteIconElement) => {
      deleteIconElement.classList.remove("disabled");
      addItemDeleteIconHover(deleteIconElement);
    });
  };

  const deactivateItemDeleteIcons = function deactivateItemDeleteIcons(
    deleteIcons,
  ) {
    deleteIcons.forEach((deleteIconElement) => {
      deleteIconElement.classList.add("disabled");
      deleteIconElement.removeEventListener(
        "mouseenter",
        todoItemDeleteIconHoverHandler,
      );
    });
  };

  const disableIconIfNeeded = function considerDiablingItemAddIcon(project) {
    const projectName = project.getProjectName();
    const items = [...todoItemsContainerElement.children];
    const deleteIcons = items.map((item) => item.lastElementChild);

    activateProjectAddIcon(itemAddIcon);
    activateItemDeleteIcons(deleteIcons);
    itemAddIcon.style.cursor = "pointer";
    if (projectName === "COMPLETED") {
      deactivateProjectAddIcon(itemAddIcon);
      deactivateItemDeleteIcons(deleteIcons);
      itemAddIcon.style.cursor = "default";
    }
  };

  const generateDueDateValue = function generateAppropriateStringForDaysDiff(
    dueDate,
  ) {
    const todayDate = format(Date.now(), "yyyy-MM-dd");
    const daysDifference = differenceInCalendarDays(dueDate, todayDate);

    let resultString = "";
    if (daysDifference < 0) resultString = "Overdue";
    else if (daysDifference === 0) resultString = "Today";
    else if (daysDifference === 1) resultString = "Tomorrow";
    else if (daysDifference > 1) resultString = `${daysDifference} days left`;
    else resultString = "...";

    return resultString;
  };

  const checkBoxClickHandler = function todoItemCheckBoxClickHandler(event) {
    const itemElement = event.target.parentElement.parentElement;
    const itemIndex = itemElement.dataset.index;
    const item = currentProject.getTodoItemWithIndex(itemIndex);

    item.setCompleted(!item.isCompleted());
    if (item.isCompleted()) completedProject.addTodoItem(item);
    else completedProject.removeTodoItem(item);
    // eslint-disable-next-line no-use-before-define
    updateItems(currentProject);
  };

  const changeElementsTextDecorationFactory =
    function changeElementsTextDecorationFactory(textDecoration) {
      return function changeElementsTextDecoration(elements) {
        elements.forEach((element) => {
          // eslint-disable-next-line no-param-reassign
          element.style.textDecoration = textDecoration;
        });
      };
    };

    const generatePriorityText = function generatePriorityText(itemPriority) {
      const HIGH = "!!!";
      const MID = "!!";
      const LOW = "!";
      const itemPriorities = [HIGH, MID, LOW];
      return itemPriorities[itemPriority];
    }

  const crossElements = changeElementsTextDecorationFactory("line-through");
  const resetElementsTextDecoration = changeElementsTextDecorationFactory("");

  const updateItems = function displayTodoItems(project) {
    todoItemsContainerElement.textContent = "";
    changeHeading(project);

    project.getTodoItems().forEach((item, index) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("todo-item");
      itemContainer.dataset.index = index;

      const checkBoxLabel = document.createElement("label");
      checkBoxLabel.classList.add("checkbox-label");
      const checkBoxElement = document.createElement("input");
      checkBoxElement.type = "checkbox";
      checkBoxElement.addEventListener("click", checkBoxClickHandler);
      checkBoxLabel.appendChild(checkBoxElement);

      const itemTitleElement = document.createElement("p");
      itemTitleElement.classList.add("item-title");
      itemTitleElement.textContent = item.getTitle();

      const itemPriorityElement = document.createElement("span");
      itemPriorityElement.classList.add("item-priority");
      itemPriorityElement.textContent = generatePriorityText(item.getPriority()) || "";
      const itemProjectElement = document.createElement("span");
      itemProjectElement.classList.add("item-project");
      itemProjectElement.textContent = item.getProject();
      itemTitleElement.appendChild(itemPriorityElement);
      itemTitleElement.appendChild(itemProjectElement);

      const itemDueDateElement = document.createElement("p");
      itemDueDateElement.classList.add("item-due-date");
      itemDueDateElement.textContent = item.isCompleted()
        ? "done"
        : generateDueDateValue(item.getDueDate());

      const itemDeleteIcon = deleteIcon.cloneNode(true);
      itemDeleteIcon.classList.add("item-delete-icon");
      itemDeleteIcon.dataset.state = "default";
      addItemDeleteIconHover(itemDeleteIcon);

      const elementsToChangeTextDecoration = [
        itemTitleElement,
      ];

      todoItemsContainerElement.appendChild(itemContainer);
      itemContainer.appendChild(checkBoxLabel);
      itemContainer.appendChild(itemTitleElement);
      itemContainer.appendChild(itemDueDateElement);
      itemContainer.appendChild(itemDeleteIcon);

      disableIconIfNeeded(project);
      if (item.isCompleted()) {
        crossElements(elementsToChangeTextDecoration);
        checkBoxElement.checked = true;
      } else {
        resetElementsTextDecoration(elementsToChangeTextDecoration);
      }
    });
  };

  const deleteProjectHandler = function delectProjectEvent(event) {
    const projectElement = event.target.previousElementSibling;
    const projectIndex = projectElement.dataset.index;
    workspace.removeProjectWithIndex(projectIndex);
    updateProjects();
  };

  const deleteItemHandler = function deleteItemEvent(event) {
    const itemElement =
      event.target.parentElement.nodeName === "DIV"
        ? event.target.parentElement
        : event.target.parentElement.parentElement;
    const parentProjectName =
      itemElement.firstElementChild.nextElementSibling.lastElementChild
        .textContent;
    const itemIndex = itemElement.dataset.index;
    const item = currentProject.getTodoItemWithIndex(itemIndex);

    if (currentProject === defaultProject && parentProjectName !== "DEFAULT") {
      const parentProject = workspace.getProjectWithName(parentProjectName);

      parentProject.removeTodoItem(item);
      defaultProject.removeTodoItem(item);
    } else if (
      currentProject === defaultProject &&
      parentProjectName === "DEFAULT"
    ) {
      currentProject.removeTodoItemWithIndex(itemIndex);
    } else {
      currentProject.removeTodoItem(item);
      defaultProject.removeTodoItem(item);
    }
    updateItems(currentProject);
  };

  const projectsClickHanlderFactory = function GenerateProjectsClickHander(
    workspaceType,
  ) {
    return function handleClick(event) {
      const projectIndex = Number(event.target.dataset.index);

      if (Number.isInteger(projectIndex)) {
        currentProject = workspaceType.getProjectWithIndex(projectIndex);
        updateItems(currentProject);
      }
    };
  };

  const defaultProjectsClickHandler =
    projectsClickHanlderFactory(defaultWorkspace);
  defaultProjectsElement.addEventListener("click", defaultProjectsClickHandler);
  const projectsClickHandler = projectsClickHanlderFactory(workspace);
  projectsElement.addEventListener("click", projectsClickHandler);

  const checkFormControlValidity = function checkIndiviualControlValidity(
    controlElement,
  ) {
    if (!controlElement.checkValidity()) {
      controlElement.classList.add("invalid");
    }
  };

  const addLiveValidityCheck = function addLiveValidityCheckForFormControls(
    inputFields,
  ) {
    inputFields.forEach((input) =>
      input.addEventListener("input", (event) => {
        if (event.target.checkValidity())
          event.target.classList.remove("invalid");
        else event.target.classList.add("invalid");
      }),
    );
  };

  const reportFormControlError = function reportFormControlError(form) {
    form.reportValidity();
    const inputFields = getInputFieldsInsideForm(form);
    inputFields.forEach(checkFormControlValidity);
    addLiveValidityCheck(inputFields);
  };

  const resetFormControls = function resetFormControlsValues(form) {
    const inputFields = [...form.children];
    inputFields.forEach((input) => {
      if (input.nodeName === "SELECT") {
        // eslint-disable-next-line no-param-reassign
        input.value = "default";
        // eslint-disable-next-line no-param-reassign
      } else input.value = "";
    });
  };

  const projectAddHandler = function addNewProjectToWorkspace(event) {
    event.preventDefault();

    if (projectDialogForm.checkValidity()) {
      // const inputField = event.target.parentElement.previousElementSibling;
      const inputField = getInputFieldsInsideForm(projectDialogForm)[0];
      let projectName = inputField.value;
      if (!projectName) return;

      if (workspace.projectExists(projectName)) {
        const existingProject = workspace.getProjectWithName(projectName);
        existingProject.increaseDuplicatedNameCount();
        const count = existingProject.getDuplicatedNameCount();
        projectName = `${projectName}_${count}`;
      }

      const newProject = createProject(projectName);
      workspace.addProject(newProject);
      updateProjects();
      projectDialog.close();
      resetFormControls(projectDialogForm);
    } else {
      reportFormControlError(projectDialogForm);
    }
  };

  const todoItemAddHandler = function addTodoItemToProject(event) {
    event.preventDefault();

    if (itemDialogForm.checkValidity()) {
      const inputItems = getInputFieldsInsideForm(itemDialogForm);

      const [
        itemTitle,
        itemDescriptionValue,
        itemDueDateValue,
        itemPriorityValue,
        itemNoteValue,
      ] = inputItems.map((item) => item.value);
      let itemTitleValue = itemTitle;
      const itemProjectValue = currentProject.getProjectName();
      const parentProject = currentProject;
      if (parentProject.itemExists(itemTitleValue)) {
        const item = parentProject.getTodoItemWithTitle(itemTitleValue);
        item.increaseDuplicatedNameCount();
        const count = item.getDuplicatedNameCount();
        itemTitleValue = `${itemTitleValue}_${count}`;
      }

      const todoItem = createTodoItem({
        title: itemTitleValue,
        description: itemDescriptionValue,
        dueDate: itemDueDateValue,
        priority: itemPriorityValue,
        note: itemNoteValue,
        project: itemProjectValue,
      });
      currentProject.addTodoItem(todoItem);
      if (currentProject !== defaultProject)
        defaultProject.addTodoItem(todoItem);

      updateItems(currentProject);
      itemDialog.close();
      resetFormControls(itemDialogForm);
    } else {
      reportFormControlError(itemDialogForm);
    }
  };

  const addMinDueDate = function addTodoItemMinimumDueDate() {
    const dueDateField = document.querySelector(".item-due-date-field");
    [dueDateField.min] = new Date().toISOString().split("T");
  };

  projectAddButton.addEventListener("click", projectAddHandler);
  todoItemAddButton.addEventListener("click", todoItemAddHandler);

  const showProjectDialog = function displayProjectDialogBox() {
    projectDialog.showModal();
  };
  projectAddIcon.addEventListener("click", showProjectDialog);
  itemAddIcon.addEventListener("click", showItemDialog);

  projectCancelButton.addEventListener("click", () => {
    projectDialog.close();
    resetFormControls(projectDialogForm);
  });

  todoItemCancelButton.addEventListener("click", () => {
    itemDialog.close();
    resetFormControls(itemDialogForm);
  });

  addMinDueDate();
  updateDefaultProjects();
  updateItems(currentProject);
};

export default ScreenController;
