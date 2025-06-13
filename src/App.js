import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ValidatePage from './components/ValidatePage';
import ResultsPage from './components/ResultsPage';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/validate" element={<ValidatePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
