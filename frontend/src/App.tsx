import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import DashboardFooter from './components/DashboardFooter';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import { MusicProvider } from './components/MusicContext';
import SleepCycleSection from './components/SleepCycleSection';
import CaseHistory from './pages/CaseHistory';
import Community from './pages/Community';
import DailyActivities from "./pages/DailyActivities";
import Dashboard from './pages/Dashboard';
import ElderDashboard from './pages/ElderDashboard';
import Encyclopedia from "./pages/Encyclopedia";
import Evaluation from './pages/Evaluation';
import ImageAnalyzer from './pages/ImageAnalyser';
import Introduction from './pages/Introduction';
import Journal from './pages/Journal';
import Login from './pages/Login';
import MindfulAssistant from './pages/MindfulAssistant';
import Music from './pages/Music';
import Profile from './pages/Profile';
import Questionnaire from './pages/Questionnaire';
import Signup from './pages/Signup';
import './styles/style.css';


function App() {
  const user = useSelector((state: any) => state.user); 
  return (
    <MusicProvider>
      <Router>
        <Toaster />
        {/* This makes it global */}
        <Routes>
          <Route path="/" element={user ? <Introduction /> : <Navigate to="/login" />} /> {/* Landing page */}
          <Route path="/Questionnaire" element={<Questionnaire />} /> {/* Show 7 Questions first */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={user ? <><Dashboard /><DashboardFooter /></> : <Navigate to="/login" />} />
          <Route path="/evaluation" element={user ? <Evaluation /> : <Navigate to="/login" />} />
          <Route path="/journal" element={user ? <Journal /> : <Navigate to="/login" />} />
          <Route path="/community" element={user ? <Community /> : <Navigate to="/login" />} />
          <Route path="/music" element={user ? <Music /> : <Navigate to="/login" />} />
          <Route path="/image-analyzer" element={user ? <ImageAnalyzer /> : <Navigate to="/login" />} />
          <Route path="/assistant" element={user ? <MindfulAssistant /> : <Navigate to="/login" />} />
          <Route path="/encyclopedia" element={user ? <Encyclopedia /> : <Navigate to="/login" />} />
          <Route path="/daily-activities" element={user ? <DailyActivities /> : <Navigate to="/login" />} />
          <Route path="/case-history" element={<CaseHistory />} />
          <Route path="/SleepCycleSection" element={<SleepCycleSection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/elder-dashboard" element={<ElderDashboard />} />
          {/* <Route path="/gratitudeJournal" element={<GratitudeJournal />} /> */}
        </Routes>
        <FloatingMusicPlayer />
      </Router>
    </MusicProvider>
  );
};

export default App;
