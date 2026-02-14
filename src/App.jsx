import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { StartupProvider } from './context/StartupContext.jsx';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <StartupProvider>
          <AppRoutes />
        </StartupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
