import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import './App.css';
import Navbar from './Components/Navbar';
import { ThemeProvider } from './Components/theme-provider';
import Home from './pages/Home';
import Canvas from './pages/Canvas';
import Gallery from './pages/Gallery';
import Pricing from './pages/Pricing';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenProvider } from './lib/api';

function AppContent() {
  const location = useLocation();
  const { getToken } = useAuth();
  const isCanvasPage = location.pathname.startsWith('/canvas/');

  useEffect(() => {
    // register a token provider so api requests auto-attach Clerk token
    setTokenProvider(async  () => {
      try {
        return await getToken();
      } catch (e) {
        return undefined;
      }
    });
  }, [getToken]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isCanvasPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/canvas/:id"
          element={
            <SignedIn>
              <Canvas />
            </SignedIn>
          }
        />
        <Route
          path="/gallery"
          element={
            <SignedIn>
              <Gallery />
            </SignedIn>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;