const defaultState = {
    body: {
        todos: []
    },
    alerts: {
        error: "",
        success: ""
    }
};


export default (state = defaultState, action) => {
    switch (action.type) {
        case 'TODO/UPDATE-TODOS':
            return {
                ...state,
                body: {
                    todos: action.todos
                }
            };
        case 'TODO/DELETE-TODO':
            return {
                ...state,
                body: {
                    // Filter out selected todo
                    todos: state.body.todos.filter(existing => existing.todoID !== action.todoID)
                }
            };
        case 'TODO/UPDATE-TODO':
            return {
                ...state,
                body: {
                    // Update todo list with new todo
                    todos: state.body.todos.map(existing =>
                        existing.todoID === action.todo.todoID ? action.todo : existing
                    )
                }
            };
        case 'TODO/SORT-TODOS':
            let sorted = state.body.todos;

            // Sort the todo list
            switch (action.sort) {
                case "date-ascending":
                    sorted = sorted.sort((a, b) => Date.parse(a.created) - Date.parse(b.created));
                    break;
                case "date-descending":
                    sorted = sorted.reverse((a, b) => Date.parse(a.created) - Date.parse(b.created));
                    break;
                case "name-ascending":
                    sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "name-descending":
                    sorted = sorted.reverse((a, b) => a.name.localeCompare(b.name));
                    break;
            }

            return {
                ...state,
                body: {
                    todos: sorted
                }
            };
        case 'TODO/ERROR':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    error: action.error
                }
            };
        case 'TODO/SUCCESS':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    success: action.success
                }
            };
        case 'TODO/CLEAR-ALERTS':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts
                }
            };
        case 'TODO/CLEAR':
            return {
                ...defaultState
            };
        default:
            return state;
    }
};