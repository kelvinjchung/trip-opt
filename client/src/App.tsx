import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/plan" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
