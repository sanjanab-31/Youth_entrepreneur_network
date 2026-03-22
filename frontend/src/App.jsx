import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { StartupProvider } from './context/StartupContext.jsx';
import { MentorProvider } from './context/MentorContext.jsx';
import { IncubatorProvider } from './context/IncubatorContext.jsx';
import { MessagingProvider } from './context/MessagingContext.jsx';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MessagingProvider>
          <StartupProvider>
            <MentorProvider>
              <IncubatorProvider>
                <AppRoutes />
              </IncubatorProvider>
            </MentorProvider>
          </StartupProvider>
        </MessagingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
