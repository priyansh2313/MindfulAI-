import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import DashboardFooter from './components/DashboardFooter';
import CareConnect from './components/elder/CareConnect/CareConnectDashboard';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import { MusicProvider } from './components/MusicContext';
import ProtectedRoute from './components/ProtectedRoute';
import SleepCycleSection from './components/SleepCycleSection';
import { AuthProvider } from './contexts/AuthContext';
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
import { setUser } from './redux/slices/userSlice';
import './styles/style.css';
import { getCurrentUser, isAuthenticated } from './utils/auth';


import ElderGamesPage from './pages/games.tsx';
import GameViewer from './pages/GameViewer.tsx';
import ElderStorytellingPage from './pages/storytelling.tsx';
import StoryViewer from './pages/StoryViewer.tsx';

// 👇 Import your new Sleep Tracker & Insights Page 👇
import SleepInsightsPage from './pages/SleepInsightsPage';
import SleepTrackerPage from './pages/SleepTrackerPage';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user?.user);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = () => {
      const hasLocalAuth = isAuthenticated();
      const localUser = getCurrentUser();

      if (hasLocalAuth && localUser) {
        dispatch(setUser(localUser));
      }
    };

    initializeAuth();
  }, [dispatch]);

  const GoogleSignupWrapper = () => {
		return (
			<GoogleOAuthProvider clientId="747510449420-40qrn383fub6d1677a31hf5rv8vd0bro.apps.googleusercontent.com">
				<Signup />
			</GoogleOAuthProvider>
		);
	};

	const GoogleLoginWrapper = () => {
		return (
			<GoogleOAuthProvider clientId="747510449420-40qrn383fub6d1677a31hf5rv8vd0bro.apps.googleusercontent.com">
				<Login />
			</GoogleOAuthProvider>
		);
	};

  

  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <Toaster />
          <Routes>
          {/* Public routes - accessible without authentication */}
         <Route path="/signup" element={<GoogleSignupWrapper />} />
					<Route path="/login" element={<GoogleLoginWrapper />} />
          <Route path="/Questionnaire" element={<Questionnaire />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/invitation/:invitationId" element={<InvitationAccept />} />
          <Route path="/care-connect-test" element={<CareConnectTest />} />

          {/* Protected routes - require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Introduction />} />
            <Route path="/dashboard" element={<><Dashboard /><DashboardFooter /></>} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/view/:entryId" element={<JournalView />} />
            <Route path="/community" element={<Community />} />
            <Route path="/music" element={<Music />} />
            <Route path="/image-analyzer" element={<ImageAnalyzer />} />
            <Route path="/assistant" element={<MindfulAssistant />} />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="/daily-activities" element={<DailyActivities />} />
            <Route path="/case-history" element={<CaseHistory />} />
            <Route path="/SleepCycleSection" element={<SleepCycleSection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/elder-dashboard" element={<><ElderDashboard /><DashboardFooter/></>} />
            <Route path="/care-connect" element={<CareConnect />} />
            <Route path="/games" element={<ElderGamesPage />} />
            <Route path="/storytelling" element={<ElderStorytellingPage />} />
            <Route path="/games/:gameId" element={<GameViewer />} />
            <Route path="/storytelling/story-corner-main" element={<StoryViewer />} />
            <Route path="/sleep-tracker" element={<SleepTrackerPage />} />
            <Route path="/sleep-insights" element={<SleepInsightsPage />} />
          </Route>

          {/* Role-based protected routes */}
          <Route 
            path="/family-dashboard" 
            element={
              user && user.role === 'family' ? 
              <FamilyDashboard /> : 
              <Navigate to="/login" replace />
            } 
          />

          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <FloatingMusicPlayer />
      </Router>
        </MusicProvider>
      </AuthProvider>
  );
}








export default App;
