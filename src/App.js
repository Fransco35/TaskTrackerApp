import "./App.css";
import { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Collapse from "react-bootstrap/Collapse";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

function App() {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const dueRef = useRef();

  const [open, setOpen] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    due: "",
    isComplete: false,
    reminder: false,
  });
  const [taskList, setTaskList] = useState([]);
  const [editedId, setEditedId] = useState(null);
  const [toggleSubmit, setToggleSubmit] = useState(true);

  function handleEdit(id) {
    setOpen(true);
    setToggleSubmit(false);

    const selectedTask = taskList.find((task) => task.id === id);

    titleRef.current.value = selectedTask.title;
    descriptionRef.current.value = selectedTask.description;
    dueRef.current.value = selectedTask.due;

    setEditedId(id);
  }

  function handleDelete(id) {
    const newTaskList = taskList.filter((task) => task.id !== id);
    setTaskList(newTaskList);
  }

  function toggleReminder(id) {
    setTaskList(
      taskList.map((task) => {
        if (task.id === id) {
          return { ...task, reminder: !task.reminder };
        } else {
          return task;
        }
      })
    );
  }

  function toggleCompletion(id) {
    setTaskList(
      taskList.map((task) => {
        if (task.id === id) {
          return { ...task, isComplete: !task.isComplete };
        } else {
          return task;
        }
      })
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const due = dueRef.current.value;

    if (title.trim() === "" || description.trim() === "" || due.trim() === "") {
      return alert("Fill all required inputs");
    }

    if (!toggleSubmit) {
      setTaskList(
        taskList.map((taskItem) => {
          if (taskItem.id === editedId) {
            return {
              ...taskItem,
              title: title,
              description: description,
              due: due,
            };
          }
          return taskItem;
        })
      );

      titleRef.current.value = " ";
      descriptionRef.current.value = " ";
      dueRef.current.value = " ";
      setToggleSubmit(true);
    } else {
      setTask({
        title: title,
        description: description,
        due: due,
      });

      setTaskList([
        ...taskList,
        {
          id: Date.now(),
          title: title,
          description: description,
          due: due,
        },
      ]);

      titleRef.current.value = " ";
      descriptionRef.current.value = " ";
      dueRef.current.value = " ";
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
        <Row>
          {taskList.length < 1 && (
            <div className="taskH1">
              <h2>You have no tasks</h2>
            </div>
          )}

          {taskList.map((task) => {
            return (
              <Col sm={12} md={6} lg={3} key={task.id} className="col">
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
        </Row>
      </Container>
    </div>
  );
}

export default App;
