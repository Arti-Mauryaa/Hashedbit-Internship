import { useState } from "react";
import Calculator from "./components/Calculator";
import Todo from "./components/Todo";
import IPLTable from "./components/IPLTable";

function App() {
  const [assignment, setAssignment] = useState("");

  return (
    <div>
      <h1>React Assignments</h1>

      <button onClick={() => setAssignment("calculator")}>
        Assignment 5 - Calculator
      </button>

      <button onClick={() => setAssignment("todo")}>
        Assignment 6 - Todo App
      </button>

      <button onClick={() => setAssignment("ipl")}>
        Assignment 7 - IPL Points Table
      </button>

      <hr />

      {assignment === "calculator" && <Calculator />}
      {assignment === "todo" && <Todo />}
      {assignment === "ipl" && <IPLTable />}
    </div>
  );
}

export default App;