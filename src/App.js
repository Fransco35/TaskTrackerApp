import "./App.css";
import { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Collapse from "react-bootstrap/Collapse";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

function App() {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const dueRef = useRef();

  const [open, setOpen] = useState(false);
  const [taskList, setTaskList] = useState([
    {
      title: "First",
      description: "This is the default task",
      due: "2023-10-10",
      isComplete: false,
      reminder: false,
    },
  ]);
  const [editedId, setEditedId] = useState(null);
  const [toggleSubmit, setToggleSubmit] = useState(true);

  function handleEdit(id) {
    // To open form in GUI
    setOpen(true);

    //  To indicate its an Edit action in the handleSubmit() function
    setToggleSubmit(false);

    //  Find the task that its id is directly equal to the id that is received in this function argument
    const selectedTask = taskList.find((task) => task.id === id);

    //  Fill the form input fields with the selected task values
    titleRef.current.value = selectedTask.title;
    descriptionRef.current.value = selectedTask.description;
    dueRef.current.value = selectedTask.due;

    //  set the edited Id state to the one passed in the function so that it will be use in the handleSubmit() function
    setEditedId(id);
  }

  function handleDelete(id) {
    // Loop through the tasklist and only return the tasks that their id does not match the one passed in the argument
    const newTaskList = taskList.filter((task) => task.id !== id);

    // set the taskList to the filtered taskList
    setTaskList(newTaskList);
  }

  function toggleReminder(id) {
    setTaskList(
      // loop through the tasklist
      taskList.map((task) => {
        // check for the task whose id is equivalent to the one passed as the function argument
        if (task.id === id) {
          return {
            // return the particular task and update the value of the reminder to its direct opposite since its a boolean
            ...task,
            reminder: !task.reminder,
          };
        }
        // if no id matches then just return the task
        else {
          return task;
        }
      })
    );
  }

  function toggleCompletion(id) {
    // loop through the tasklist
    setTaskList(
      // check for the task whose id is equivalent to the one passed as the function argument

      taskList.map((task) => {
        if (task.id === id) {
          return {
            // return the particular task and update the value of the isComplete key to its direct opposite since its a boolean
            ...task,
            isComplete: !task.isComplete,
          };
        } else {
          // if no id matches then just return the task
          return task;
        }
      })
    );
  }

  function handleSubmit(event) {
    // prevent browser default refresh
    event.preventDefault();

    // Get input field values
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const due = dueRef.current.value;

    // check if any of the input fields value is empty
    const isAnyInputFieldEmpty =
      title.trim() === "" || description.trim() === "" || due.trim() === "";

    // Check if the input fields being empty is true or false
    if (isAnyInputFieldEmpty) {
      // if any of the input fields is empty
      return alert("All input fields must have values");
    }

    if (!toggleSubmit) {
      // If it is a task that needs to be edited
      setTaskList(
        // iterate through the array of tasks to get the task object whose Id matches the edited Id
        taskList.map((taskItem) => {
          if (taskItem.id === editedId) {
            // update the item with the matching id
            return {
              ...taskItem,
              title: title,
              description: description,
              due: due,
            };
          }
          // return the updated item that was edited
          return taskItem;
        })
      );

      // update the form input fields by setting it to its default empty state
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      dueRef.current.value = "";

      setToggleSubmit(true);
    }
    // if the task is new
    else {
      setTaskList([
        // Add the previous tasks
        ...taskList,
        // Add new task to the taskList
        {
          id: Date.now(),
          title: title,
          description: description,
          due: due,
        },
      ]);

      // update the form input fields by setting it to its default empty value
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      dueRef.current.value = "";
    }
  }

  return (
    <div className="App">
      <div className="containerOne">
        <Collapse in={open}>
          <div>
            <Form className="form" onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title..."
                  ref={titleRef}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description..."
                  ref={descriptionRef}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Due Date</Form.Label>
                <Form.Control type="date" ref={dueRef} required />
              </Form.Group>
              <Button variant="outline-primary" type="submit">
                {toggleSubmit ? "Add" : "Update"}
              </Button>{" "}
              <Button variant="outline-primary" onClick={() => setOpen(!open)}>
                Close
              </Button>
            </Form>
          </div>
        </Collapse>

        <div>
          {!open && (
            <Button
              variant="outline-primary"
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              New Task
            </Button>
          )}
        </div>
      </div>

      <Container className="containerTwo">
        {taskList.length < 1 && (
          <div className="taskH1">
            <h2>You have no tasks</h2>
          </div>
        )}

        {taskList.map((task) => {
          return (
            <Col key={task.id} className="col">
              <Card className="taskCard">
                <Card.Body>
                  <Button
                    variant="outline-primary"
                    className="cardBtn"
                    onClick={() => handleEdit(task.id)}
                  >
                    Edit
                  </Button>
                  <Card.Title>{task.title}</Card.Title>
                  <Card.Subtitle className="mb-2">
                    Due on - {task.due}
                  </Card.Subtitle>
                  <Card.Text>{task.description}</Card.Text>
                  <div className="reminderBox">
                    <label htmlFor="reminder"> Set Reminder</label>
                    <div
                      onClick={() => toggleReminder(task.id)}
                      className="reminder"
                      style={
                        task.reminder
                          ? { backgroundColor: "#0d6efd", color: "#fff" }
                          : { backgroundColor: "#6c757d", color: "#fff" }
                      }
                    >
                      {task.reminder ? "ON" : "OFF"}
                    </div>
                  </div>
                  <div className="completionBox">
                    <input
                      type="checkbox"
                      value={task.isComplete}
                      onClick={() => toggleCompletion(task.id)}
                    />
                    <div
                      className="completion"
                      style={
                        task.isComplete
                          ? { backgroundColor: "#0d6efd", color: "#fff" }
                          : { backgroundColor: "#6c757d", color: "#fff" }
                      }
                    >
                      {task.isComplete ? "Complete" : "Incomplete"}
                    </div>
                  </div>
                  <Button
                    variant="outline-primary"
                    className="mt-2"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Container>
    </div>
  );
}

export default App;
