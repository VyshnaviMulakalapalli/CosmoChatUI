import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const LandingPage = () => (
  <div style={{ textAlign: 'center', marginTop: '20%' }}>
    <h1>Welcome to the Chat App</h1>
    <Link to="/chat" style={{ textDecoration: 'none' }}>
      <Button variant="contained" color="primary">
        Start Chat
      </Button>
    </Link>
    <Link to="/dashboard" style={{ textDecoration: 'none', marginLeft: '10px' }}>
      <Button variant="contained" color="secondary">
        View Dashboard
      </Button>
    </Link>
  </div>
);

export default LandingPage;
