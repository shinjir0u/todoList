const createTodoItem = function TodoItem({
  title = "",
  description = "",
  dueDate = "",
  priority = "",
  note = "",
  project = "",
} = {}) {
  let itemTitle = title;
  let itemDescription = description;
  let itemDueDate = dueDate;
  let itemPriority = priority;
  let itemNote = note;
  let itemProject = project;
  let completed = false;
  let duplicatedNameCount = 0;

  const setTitle = (titleValue) => {
    itemTitle = titleValue;
  };

  const setDescription = (descriptionValue) => {
    itemDescription = descriptionValue;
  };

  const setDueDate = (dueDateValue) => {
    itemDueDate = dueDateValue;
  };

  const setPriority = (priorityValue) => {
    itemPriority = priorityValue;
  };

  const setNote = (noteValue) => {
    itemNote = noteValue;
  };

  const setProject = (projectValue) => {
    itemProject = projectValue;
  };

  const setCompleted = (completedValue) => {
    completed = completedValue;
  };

  const increaseDuplicatedNameCount = () => {
    duplicatedNameCount += 1;
  };

  const getDuplicatedNameCount = () => duplicatedNameCount;

  const getTitle = () => itemTitle;
  const getDescription = () => itemDescription;
  const getDueDate = () => itemDueDate;
  const getPriority = () => itemPriority;
  const getNote = () => itemNote;
  const getProject = () => itemProject;
  const isCompleted = () => completed;

  return {
    setTitle,
    setDescription,
    setDueDate,
    setPriority,
    setNote,
    setProject,
    setCompleted,
    getTitle,
    getDescription,
    getDueDate,
    getPriority,
    getNote,
    getProject,
    isCompleted,
    increaseDuplicatedNameCount,
    getDuplicatedNameCount,
  };
};

const createListContainer = function ListContainer() {
  const itemList = [];
  // eslint-disable-next-line prefer-const
  let duplicatedNameCount = 0;

  const addItemToList = (item) => {
    itemList.push(item);
  };

  const removeItemWithIndex = (itemIndex) => {
    itemList.splice(itemIndex, 1);
  };

  const removeItem = (item) => {
    const itemIndex = itemList.indexOf(item);
    removeItemWithIndex(itemIndex);
  };

  const getItemFromListWithIndex = (itemIndex) => itemList[itemIndex];

  const getItemWithTitle = (itemTitle) => {
    const [requiredItem] = itemList.filter(
      (item) => item.getTitle() === itemTitle,
    );
    return requiredItem;
  };

  const getItemList = () => itemList;

  const increaseDuplicatedNameCount = () => {
    duplicatedNameCount += 1;
  };

  const getDuplicatedNameCount = () => duplicatedNameCount;

  return {
    addItemToList,
    removeItemWithIndex,
    removeItem,
    getItemFromListWithIndex,
    getItemWithTitle,
    getItemList,
    increaseDuplicatedNameCount,
    getDuplicatedNameCount,
  };
};

const createProject = function Project(name) {
  const projectName = name;
  const itemList = createListContainer();

  const getProjectName = () => projectName;

  const itemExists = (itemTitle) => {
    const [foundItem] = itemList
      .getItemList()
      .filter((item) => item.getTitle() === itemTitle);
    return !!foundItem;
  };

  return {
    getProjectName,
    itemExists,
    addTodoItem: itemList.addItemToList,
    removeTodoItemWithIndex: itemList.removeItemWithIndex,
    removeTodoItem: itemList.removeItem,
    getTodoItemWithIndex: itemList.getItemFromListWithIndex,
    getTodoItemWithTitle: itemList.getItemWithTitle,
    getTodoItems: itemList.getItemList,
    getDuplicatedNameCount: itemList.getDuplicatedNameCount,
    increaseDuplicatedNameCount: itemList.increaseDuplicatedNameCount,
  };
};

const createWorkspace = function Workspace() {
  const itemList = createListContainer();

  const getProjectWithName = (projectName) => {
    const projects = itemList.getItemList();

    const [requiredItem] = projects.filter(
      (project) => project.getProjectName() === projectName,
    );
    return requiredItem;
  };

  const projectExists = (projectName) => {
    const [foundProject] = itemList
      .getItemList()
      .filter((project) => project.getProjectName() === projectName);
    return !!foundProject;
  };

  return {
    getProjectWithName,
    projectExists,
    addProject: itemList.addItemToList,
    removeProjectWithIndex: itemList.removeItemWithIndex,
    getProjectWithIndex: itemList.getItemFromListWithIndex,
    getProjects: itemList.getItemList,
  };
};

const createDefaultWorkspace = function DefaultWorkspace() {
  const itemList = [];
  const defaultProject = createProject("DEFAULT");
  const completedProject = createProject("COMPLETED");

  itemList.push(defaultProject, completedProject);

  const getProjectWithIndex = (index) => itemList[index];

  const getProjectWithName = (projectName) => {
    const projects = itemList;

    const [requiredItem] = projects.filter(
      (project) => project.getProjectName() === projectName,
    );
    return requiredItem;
  };

  return {
    getProjectWithIndex,
    getProjectWithName,
    getDefaultProjects: () => itemList,
    getDefaultProject: () => defaultProject,
    getCompletedProject: () => completedProject,
  };
};

export {
  createTodoItem,
  createProject,
  createDefaultWorkspace,
  createWorkspace,
};
