import React, { useState } from 'react';
import QueryForm from './components/QueryForm';
import { Box, Typography, Button } from '@mui/material';
import './index.css';

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');

  // Handle query submission from QueryForm
  const handleQuerySubmit = (query) => {
    if (query.trim()) {
      const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setQueryHistory([{ id: Date.now(), timestamp, query }, ...queryHistory]);
    }
  };

  // Handle clicking a history item to reuse query
  const handleHistoryClick = (query) => {
    setCurrentQuery(query);
  };

  return (
    <Box className="app-container">
      <Typography variant="h4" className="app-title">
        QuickQuery: SQL Assistant
      </Typography>
      <Button
        className="chat-history-toggle"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? 'Hide Search History' : 'Show Search History'}
      </Button>
      {showHistory && (
        <Box className="chat-history-container">
          <Typography variant="h6" className="chat-history-title">
            Search History
          </Typography>
          <Box className="chat-history-list">
            {queryHistory.length === 0 ? (
              <Typography className="chat-history-snippet">
                No queries yet.
              </Typography>
            ) : (
              queryHistory.map((item) => (
                <Box
                  key={item.id}
                  className="chat-history-item"
                  tabIndex={0}
                  onClick={() => handleHistoryClick(item.query)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleHistoryClick(item.query);
                    }
                  }}
                >
                  <Typography className="chat-history-timestamp">
                    {item.timestamp}
                  </Typography>
                  <Typography className="chat-history-snippet">
                    {item.query}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      )}
      <QueryForm
        onQuerySubmit={handleQuerySubmit}
        currentQuery={currentQuery}
        setCurrentQuery={setCurrentQuery}
      />
    </Box>
  );
}

export default App;