import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './app.css';
import GlobalProviders from './contexts/authContext';
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalProviders>
      <Router>
        <Routes>
          <Route path='/*' element={<App/>}/>
        </Routes>
      </Router>
    </GlobalProviders>
  </React.StrictMode>
);

