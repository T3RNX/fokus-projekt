import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dogs from '../pages/Dogs';
import Owner from '../pages/Owner';
import Treatments from '../pages/Treatment';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/dogs" element={<Dogs />} />
                        <Route path="/owner" element={<Owner />} />
                        <Route path="/treatments" element={<Treatments />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;