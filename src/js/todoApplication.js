const createTodoItem = function TodoItem({
  title = "",
  description = "",
  dueDate = "",
  priority = "",
  note = "",
} = {}) {
  let itemTitle = title;
  let itemDescription = description;
  let itemDueDate = dueDate;
  let itemPriority = priority;
  let itemNote = note;

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

  const getTitle = () => itemTitle;
  const getDescription = () => itemDescription;
  const getDueDate = () => itemDueDate;
  const getPriority = () => itemPriority;
  const getNote = () => itemNote;

  return {
    setTitle,
    setDescription,
    setDueDate,
    setPriority,
    setNote,
    getTitle,
    getDescription,
    getDueDate,
    getPriority,
    getNote,
  };
};

const createListContainer = function ListContainer() {
  const itemList = [];

  const addItemToList = (item) => {
    itemList.push(item);
  };

  const removeItemFromList = (itemIndex) => {
    itemList.splice(itemIndex, 1);
  };

  const getItemFromList = (itemIndex) => itemList[itemIndex];

  const getItemList = () => itemList;

  return {
    addItemToList,
    removeItemFromList,
    getItemFromList,
    getItemList,
  };
};

const createProject = function Project(name) {
  const projectName = name;
  const itemList = createListContainer();

  const getProjectName = () => projectName;
  return {
    addTodoItem: itemList.addItemToList,
    removeTodoItem: itemList.removeItemFromList,
    getTodoItem: itemList.getItemFromList,
    getTodoItems: itemList.getItemList,
    getProjectName,
  };
};

const createWorkspace = function Workspace() {
  const itemList = createListContainer();
  return {
    addProject: itemList.addItemToList,
    removeProject: itemList.removeItemFromList,
    getProject: itemList.getItemFromList,
    getProjects: itemList.getItemList,
  };
};

const createDefaultWorkspace = function DefaultWorkspace() {
  const itemList = [];
  const defaultProject = createProject("DEFAULT");
  const completedProject = createProject("COMPLETED");

  itemList.push(defaultProject, completedProject);

  const getProject = (index) => itemList[index];

  return {
    getDefaultProjects: () => itemList,
    getDefaultProject: () => defaultProject,
    getCompletedProject: () => completedProject,
    getProject,
  };
};

export {
  createTodoItem,
  createProject,
  createDefaultWorkspace,
  createWorkspace,
};
