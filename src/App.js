import "./App.css";
import { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import About from "./components/About";
import NoteState from "./context/notes/NotesState";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({ message: message, type: type });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  const [mode, setmode] = useState("light");
  const toggleMode = () => {
    if (mode === "light") {
      setmode("dark");
      document.body.style.backgroundColor = "rgba(33,37,41,1)";
      showAlert("DarkMode is Enabled", "success");
      //  document.title='TextUtils - DarkMode';
      // setInterval(() => {
      //   document.title='TextUtils is Amazing';
      // }, 2000);
      // setInterval(() => {
      //   document.title='Install TextUtils Now';
      // }, 1500);
    } else {
      setmode("light");
      document.body.style.backgroundColor = "white";
      showAlert("LightMode is Enabled", "success");
      // document.title='TextUtils - LightMode';
    }
  };
  return (
    <>
      <NoteState>
        <Router>
          <Navbar showAlert={showAlert} mode={mode} toggleMode={toggleMode} />
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              <Route
                exact
                path="/"
                element={<Home mode={mode} showAlert={showAlert} />}
              />
              <Route exact path="/about" element={<About mode={mode} />} />
              <Route
                exact
                path="/login"
                element={<Login showAlert={showAlert} mode={mode} />}
              />
              <Route
                exact
                path="/signup"
                element={<Signup showAlert={showAlert} mode={mode} />}
              />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
