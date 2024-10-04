import { LinkedInCallback } from "react-linkedin-login-oauth2";
import "./App.css";
import LinkedInPage from "./components/linkedInLogin";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/linkedin" element={<LinkedInCallback />} />
        <Route exact path="/" element={<LinkedInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
