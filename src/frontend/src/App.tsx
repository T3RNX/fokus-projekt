import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Dogs from "../pages/Dogs";
import CreateDogPage from "../pages/CreateDogPage";
import DogDetailsPage from "../pages/DogDetailsPage";
import Owner from "../pages/Owner";
import Treatments from "../pages/Treatments";
import CreateTreatmentPage from "../pages/CreateTreatmentPage";
import CreateOwnerPage from "../pages/CreateOwnerPage";
import Settings from "../pages/Settings";
import { ThemeProvider } from "../context/ThemeContext";
import TreatmentDetailsPage from "../pages/TreatmentDetailsPage";
import OwnerDetailsPage from "../pages/OwnerDetailsPage";

function App() {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/dogs/create" element={<CreateDogPage />} />
          <Route path="/dogs/:dogID" element={<DogDetailsPage />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/owner/create" element={<CreateOwnerPage />} />
          <Route path="/owner/:ownerID" element={<OwnerDetailsPage />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/treatments/create" element={<CreateTreatmentPage />} />
          <Route
            path="/treatments/:treatmentID"
            element={<TreatmentDetailsPage />}
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default App;
