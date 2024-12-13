import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Dogs from "../pages/Dogs";
import Owner from "../pages/Owner";
import Treatments from "../pages/Treatments";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import CreateDogPage from "../pages/CreateDogPage";

const App = () => {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/dogs/create" element={<CreateDogPage />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;
