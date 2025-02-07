import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <Form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <>
          <Form.Label htmlFor="inputTimeout">Время (мин.)</Form.Label>
          <Form.Control
            type="number"
            id="inputTimeout"
            onChange={(e) => setName(e.currentTarget.value)}
            aria-describedby="timeoutHelpBlock"
          />
          <Form.Text id="timeoutHelpBlock" muted>
            Введите время
          </Form.Text>

          <Form.Label htmlFor="inputTimeout">Минимум</Form.Label>
          <Form.Control
            type="number"
            id="inputMin"
            onChange={(e) => setName(e.currentTarget.value)}
            aria-describedby="minHelpBlock"
          />
          <Form.Text id="minHelpBlock" muted>
            Введите мнимальное число
          </Form.Text>

          <Form.Label htmlFor="inputTimeout">Максимальное</Form.Label>
          <Form.Control
            type="number"
            id="inputMax"
            onChange={(e) => setName(e.currentTarget.value)}
            aria-describedby="maxHelpBlock"
          />
          <Form.Text id="mmaxHelpBlock" muted>
            Введите максимальное число
          </Form.Text>

          <Form.Check
            type="checkbox"
            id="default-stacked"
            label="+"
          />
          <Form.Check
            type="checkbox"
            id="default-stacked"
            label="-"
          />
          <Form.Check
            type="checkbox"
            id="default-stacked"
            label="*"
          />
          <Form.Check
            type="checkbox"
            id="default-stacked"
            label=":"
          />
        </>
        <Button type="submit">Начать</Button>
      </Form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
