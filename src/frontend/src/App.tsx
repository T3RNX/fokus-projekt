import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Dogs from '../pages/Dogs';
import Owner from '../pages/Owner';
import Treatments from '../pages/Treatment';
import Dashboard from '../pages/Dashboard';

const App = () => {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;