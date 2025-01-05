import "./css/style.css";
import ScreenController from "./js/screenController";



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
