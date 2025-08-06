import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import DashboardFooter from './components/DashboardFooter';
import CareConnect from './components/elder/CareConnect/CareConnectDashboard';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import { MusicProvider } from './components/MusicContext';
import SleepCycleSection from './components/SleepCycleSection';
import CareConnectTest from './pages/CareConnectTest';
import CaseHistory from './pages/CaseHistory';
import Community from './pages/Community';
import DailyActivities from "./pages/DailyActivities";
import Dashboard from './pages/Dashboard';
import ElderDashboard from './pages/elder/ElderDashboard';
import Encyclopedia from "./pages/Encyclopedia";
import Evaluation from './pages/Evaluation';
import FamilyDashboard from './pages/FamilyDashboard';
import HowItWorks from './pages/HowItWorks';
import ImageAnalyzer from './pages/ImageAnalyser';
import Introduction from './pages/Introduction';
import InvitationAccept from './pages/InvitationAccept';
import Journal from './pages/Journal';
import JournalView from './pages/JournalView';
import Login from './pages/Login';
import MindfulAssistant from './pages/MindfulAssistant';
import Music from './pages/Music';
import Profile from './pages/Profile';
import Questionnaire from './pages/Questionnaire';
import Signup from './pages/Signup';
import './styles/style.css';

import ElderGamesPage from './pages/games.tsx';
import ElderStorytellingPage from './pages/storytelling.tsx';
import GameViewer from './pages/GameViewer.tsx';
import StoryViewer from './pages/StoryViewer.tsx';

// 👇 Import your new Sleep Tracker & Insights Page 👇
import SleepTrackerPage from './pages/SleepTrackerPage';
import SleepInsightsPage from './pages/SleepInsightsPage';

function App() {
  const user = useSelector((state: any) => state.user); 
  return (
    <MusicProvider>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={user ? <Introduction /> : <Navigate to="/login" />} />
          <Route path="/Questionnaire" element={<Questionnaire />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={user ? <><Dashboard /><DashboardFooter /></> : <Navigate to="/login" />} />
          <Route path="/evaluation" element={user ? <Evaluation /> : <Navigate to="/login" />} />
          <Route path="/journal" element={user ? <Journal /> : <Navigate to="/login" />} />
          <Route path="/journal/view/:entryId" element={user ? <JournalView /> : <Navigate to="/login" />} />
          <Route path="/community" element={user ? <Community /> : <Navigate to="/login" />} />
          <Route path="/music" element={user ? <Music /> : <Navigate to="/login" />} />
          <Route path="/image-analyzer" element={user ? <ImageAnalyzer /> : <Navigate to="/login" />} />
          <Route path="/assistant" element={user ? <MindfulAssistant /> : <Navigate to="/login" />} />
          <Route path="/encyclopedia" element={user ? <Encyclopedia /> : <Navigate to="/login" />} />
          <Route path="/daily-activities" element={user ? <DailyActivities /> : <Navigate to="/login" />} />
          <Route path="/case-history" element={<CaseHistory />} />
          <Route path="/SleepCycleSection" element={<SleepCycleSection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/elder-dashboard" element={user ? <><ElderDashboard /><DashboardFooter/></> : <Navigate to="/login" />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/care-connect" element={user ? <CareConnect /> : <Navigate to="/login" />} />
          <Route path="/care-connect-test" element={<CareConnectTest />} />
          <Route path="/invitation/:invitationId" element={<InvitationAccept />} />
          <Route path="/family-dashboard" element={user && user.role === 'family' ? <FamilyDashboard /> : <Navigate to="/login" />} />
          <Route path="/games" element={user ? <ElderGamesPage /> : <Navigate to="/login" />} />
          <Route path="/storytelling" element={user ? <ElderStorytellingPage /> : <Navigate to="/login" />} />
          <Route path="/games/:gameId" element={user ? <GameViewer /> : <Navigate to="/login" />} />
          <Route path="/storytelling/story-corner-main" element={user ? <StoryViewer /> : <Navigate to="/login" />} />
          {/* 👇 Add both tracker and insights routes 👇 */}
          <Route path="/sleep-tracker" element={<SleepTrackerPage />} />
          <Route path="/sleep-insights" element={<SleepInsightsPage />} />

        </Routes>
        <FloatingMusicPlayer />
      </Router>
    </MusicProvider>
  );
};

export default App;
