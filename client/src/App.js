import React from "react";
import "./App.css";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Button from "react-bootstrap/Button";
import background from "../src/Malibu_Beach.png";

const READ_TODOS = gql`
  query todos {
    todos {
      id
      text
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text)
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!) {
    updateTodo(id: $id)
  }
`;

function App() {
  let input;
  const { data, loading, error } = useQuery(READ_TODOS); //define "data" in the create query to whatever suitable.
  const [createTodo] = useMutation(CREATE_TODO);
  const [deleteTodo] = useMutation(REMOVE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className="container">
      <h3 className="header">🛒 Grocery Shopping List ...</h3>
      <p className="text-style">
        Jot down the list of things you need to get the next time you go out (;
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo({ variables: { text: input.value } });
          input.value = "";
          window.location.reload();
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="Enter Item"
          ref={(node) => {
            input = node;
          }}
        ></input>
        <Button className="submit-btn" type="submit">
          Add!
        </Button>
      </form>
      <ul> //helloworld
        {data.todos.map((todo) => (
          <li key={todo.id} className="Incomplete">
            <span className={todo.completed ? "done" : "pending"}>
              {todo.text}
            </span>
            <button
              className="delete-btn"
              onClick={() => {
                deleteTodo({ variables: { id: todo.id } });
                window.location.reload();
                alert("Item Removed");
              }}
            >
              ❌
            </button>
            <button
              className={`btn btn-sm float-right ${
                todo.completed ? "success-btn" : "info-btn"
              }`}
              onClick={() => {
                updateTodo({ variables: { id: todo.id } });
                window.location.reload();
              }}
            >
              {todo.completed ? <span>Bought!</span> : <span>Pending</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
