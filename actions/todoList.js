// TODO/UPDATE-TODOS
export const updateTodos = ({ todos = [] }) => ({
    type: 'TODO/UPDATE-TODOS',
    todos
});

// TODO/DELETE-TODO
export const deleteTodo = ({ todoID }) => ({
    type: 'TODO/DELETE-TODO',
    todoID
});

// TODO/UPDATE-TODO
export const updateTodo = ({ todo }) => ({
    type: 'TODO/UPDATE-TODO',
    todo
});

// TODO/SORT-TODOS
export const sortTodos = ({ sort = "" }) => ({
    type: 'TODO/SORT-TODOS',
    sort
});

// TODO/CLEAR
export const clearTodo = () => ({
    type: 'TODO/CLEAR'
});

// TODO/ERROR
export const updateTodoError = ({ error = "" }) => ({
    type: 'TODO/ERROR',
    error
});

// TODO/ERROR
export const updateTodoSuccess = ({ success = "" }) => ({
    type: 'TODO/SUCCESS',
    success
});

// TODO/CLEAR-ALERTS
export const clearTodoAlerts = () => ({
    type: 'TODO/CLEAR-ALERTS'
});