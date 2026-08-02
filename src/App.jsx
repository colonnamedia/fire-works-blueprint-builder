import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Landing from './pages/Landing';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import AdvertisingQuestionnaire from './pages/AdvertisingQuestionnaire';
import AdvertisingResults from './pages/AdvertisingResults';
import WebsiteQuestionnaire from './pages/WebsiteQuestionnaire';
import WebsiteResults from './pages/WebsiteResults';

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
      </Routes>
      <Toaster />
    </Router>
  );
}
export default App;
