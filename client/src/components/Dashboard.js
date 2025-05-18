import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box className="dashboard-container">
      <Typography variant="h3" className="dashboard-title">
        Welcome to QuickQuery: SQL Assistant
      </Typography>
      <Typography variant="h6" className="dashboard-subtitle">
        Transform Natural Language into SQL Queries with Ease
      </Typography>
      <Box className="dashboard-content">
        <Box className="step-card">
          <Box className="step-indicator">1</Box>
          <Typography variant="h6" className="step-title">
            Step 1: Enter Your Query
          </Typography>
          <Typography variant="body1" className="step-text">
            Type your query in plain English, like “Show employees in Sales with salary above 50000.” QuickQuery’s intuitive interface makes it easy to get started.
          </Typography>
          <Box className="step-arrow" />
        </Box>
        <Box className="step-card">
          <Box className="step-indicator">2</Box>
          <Typography variant="h6" className="step-title">
            Step 2: Generate SQL
          </Typography>
          <Typography variant="body1" className="step-text">
            QuickQuery uses advanced natural language processing to convert your query into a precise SQL statement, ready to execute on your database.
          </Typography>
          <Box className="step-arrow" />
        </Box>
        <Box className="step-card">
          <Box className="step-indicator">3</Box>
          <Typography variant="h6" className="step-title">
            Step 3: View Results
          </Typography>
          <Typography variant="body1" className="step-text">
            Instantly see the results in a clear, tabular format, along with the generated SQL query. Review, refine, or save your query for future use.
          </Typography>
        </Box>
        <Button
          className="dashboard-button"
          onClick={() => navigate('/query')}
        >
          Start Querying
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;