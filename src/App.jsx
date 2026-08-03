import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Landing from './pages/Landing';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import AdvertisingQuestionnaire from './pages/AdvertisingQuestionnaire';
import AdvertisingResults from './pages/AdvertisingResults';
import WebsiteQuestionnaire from './pages/WebsiteQuestionnaire';
import WebsiteResults from './pages/WebsiteResults';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminClientProfile from './pages/AdminClientProfile';
import AdminAbandoned from './pages/AdminAbandoned';
import AdminRevenue from './pages/AdminRevenue';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/results" element={<Results />} />
        <Route path="/advertising" element={<AdvertisingQuestionnaire />} />
        <Route path="/advertising-results" element={<AdvertisingResults />} />
        <Route path="/website-blueprint" element={<WebsiteQuestionnaire />} />
        <Route path="/website-results" element={<WebsiteResults />} />
        <Route path="/admin" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/clients" element={<AdminClients />} />
<Route path="/admin/client/:product/:id" element={<AdminClientProfile />} />
<Route path="/admin/abandoned" element={<AdminAbandoned />} />
<Route path="/admin/revenue" element={<AdminRevenue />} />
<Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
export default App;
