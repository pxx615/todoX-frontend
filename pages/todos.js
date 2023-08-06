import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import { updateTodos, clearTodoAlerts, deleteTodo, updateTodo, updateTodoError, sortTodos } from '../actions/todoList';
import apiFetch from '../functions/apiFetch';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../components/Alert';
import Link from 'next/link';

const Todos = () => {
    const [isSaving, setIsSaving] = useState(false);
    const todoListState = useSelector((state) => state.todoList);
    const dispatch = useDispatch();

    // Run on load
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setIsSaving(true);
        dispatch(clearTodoAlerts());

        // Authenticate the user
        let userSession = await apiFetch("/user/session", { method: "GET" });
        if (userSession.status === 200) {
            // Get todos by userID
            let result = await apiFetch("/todo", { method: "GET" });
            // Update todo list in State
            if (result.status === 201) {
                dispatch(updateTodos({ todos: result.body }));
            }
            else {
                dispatch(updateTodoError({ error: result.body.error }));
            }
        }
        else {
            window.location.replace('/signin');
        }

        setIsSaving(false);
    }

    // Function to delete a todo item
    const handleDelete = async (todoID) => {
        setIsSaving(true);
        dispatch(clearTodoAlerts());

        // Delete selected todo 
        let result = await apiFetch("/todo", {
            body: { todoID },
            method: "DELETE"
        });

        // Filter out deleted Todo from State
        if (result.status === 201) {
            dispatch(deleteTodo({ todoID }));
        }
        else {
            dispatch(updateTodoError({ error: result.body.error }));
        }

        setIsSaving(false);
    };

    // Function to update todo
    const handleUpdate = async (event, newTodo) => {
        event.preventDefault();
        setIsSaving(true);
        dispatch(clearTodoAlerts());

        // Update selected todo
        let result = await apiFetch("/todo", {
            body: {
                todoID: newTodo.todoID,
                value: newTodo
            },
            method: "PATCH"
        });

        // Update Todo List in State
        if (result.status === 201) {
            dispatch(updateTodo({ todo: newTodo }));
        }
        else {
            dispatch(updateTodoError({ error: result.body.error }));
        }

        setIsSaving(false);
    };

    return (
        <PageLayout title="My todos">
            <Container>
                <div className="content">
                    <Alert message={todoListState.alerts.error} onClose={() => dispatch(clearTodoAlerts())} />
                    <Alert message={todoListState.alerts.success} onClose={() => dispatch(clearTodoAlerts())} variant="success" />
                    <div>
                        {
                            todoListState.body.todos.length === 0 ?

                                // Empty content
                                <div>
                                    <p>You have not created any Todos</p>
                                    <Link className="highlightedLink" href="/create">Create More Todos</Link>
                                </div>
                                :
                                // List of todos
                                <div>
                                    <h1>My Todos</h1>

                                    <select
                                        name="sort"
                                        id="sort"
                                        onChange={(event) => dispatch(sortTodos({ sort: event.target.value }))}
                                        disabled={isSaving}
                                    >
                                        <option value="date-ascending">Sort: Earliest to Latest</option>
                                        <option value="date-descending">Sort: Latest to Earliest</option>
                                        <option value="name-ascending">Sort: A-Z</option>
                                        <option value="name-descending">Sort: Z-A</option>
                                    </select>

                                    <ul>
                                        {
                                            todoListState.body.todos.map(todo => {
                                                return <div key={todo.todoID}>
                                                    <p>Name: {todo.name}</p>
                                                    <p>Created: {new Date(todo.created).toString()}</p>

                                                    <select
                                                        name="status"
                                                        id="status"
                                                        value={todo.status}
                                                        onChange={(event) => handleUpdate(event, { ...todo, status: event.target.value })}
                                                        disabled={isSaving}
                                                    >
                                                        <option value="done">Done</option>
                                                        <option value="inProgress">In Progress</option>
                                                        <option value="notDone">Not Done</option>
                                                    </select>

                                                    <Button
                                                        className="saveButton"
                                                        type="submit"
                                                        text="Delete"
                                                        size="small"
                                                        variant="secondary"
                                                        disabled={isSaving}
                                                        onClick={() => handleDelete(todo.todoID)}
                                                    />
                                                </div>;
                                            })
                                        }
                                    </ul>
                                    <Link className="highlightedLink" href="/create">Create More Todos</Link>
                                </div>
                        }
                    </div>
                </div>
            </Container>
            
        </PageLayout>
    );
};

export default Todos;

const Container = styled.div`
    width: 100%;

    .content {
        h1 {
            color: ${Colours.BLACK};
            font-size: ${Typography.HEADING_SIZES.M};
            font-weight: ${Typography.WEIGHTS.LIGHT};
            line-height: 2.625rem;
            margin-bottom: 2rem;
            margin-top: 1rem;
        }

        .saveButton {
            margin-top: 1rem;
        }
    }
`;