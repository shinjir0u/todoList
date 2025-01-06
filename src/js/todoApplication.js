const createTodoItem = function({title = "", description="", dueDate="", priority="", note=""} = {}) {
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
};

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
};

const createWorkspace = function() {
    const itemList = createListContainer();
    return {
        addProjectToWorkspace : itemList.addItemToList,
        removeProjectFromWorkspace : itemList.removeItemFromList,
        getProjectFromWorkspace : itemList.getItemFromList,
        getProjects : itemList.getItemList,
    };
};

const createDefaultWorkspace = function() {
    const itemList = [];
    const defaultProject = createProject("DEFAULT");
    const completedProject = createProject("COMPLETED");

    itemList.push(defaultProject, completedProject);

    const getProjectFromDefaultWorkspace = function(index) {
        return itemList[index];
    };

    return {
        getDefaultProjects : () => itemList,
        getDefaultProject : () => defaultProject,
        getCompletedProject : () => completedProject,
        getProjectFromDefaultWorkspace,
    };
};

export { createTodoItem, createProject, createDefaultWorkspace, createWorkspace };