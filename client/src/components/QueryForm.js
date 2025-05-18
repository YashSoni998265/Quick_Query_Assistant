import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import { Search } from '@mui/icons-material';

function QueryForm({ onQuerySubmit, currentQuery, setCurrentQuery }) {
  const [queryText, setQueryText] = useState(currentQuery || '');
  const [results, setResults] = useState([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQueryText(currentQuery);
  }, [currentQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    setSqlQuery('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/query', { queryText });
      setResults(response.data.results || []);
      setSqlQuery(response.data.sql || '');
      onQuerySubmit(queryText);
      setQueryText('');
      setCurrentQuery('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Box className="query-form-container">
        <Paper elevation={4} className="query-input-box">
          <form onSubmit={handleSubmit} className="query-form">
            <TextField
              label="Enter your query"
              placeholder="e.g., Show employees in Sales or Salary above 50000"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: <Search className="search-icon" />,
              }}
              className="query-input"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="query-button"
              startIcon={loading ? <CircularProgress size={20} className="loading-spinner" /> : null}
              sx={{ mt: 2 }}
            >
              {loading ? 'Processing...' : 'Run Query'}
            </Button>
          </form>
        </Paper>

        {error && (
          <Alert severity="error" className="error-alert" sx={{ mt: 3, mb: 2 }}>
            {error}
          </Alert>
        )}

        {sqlQuery && (
          <Box className="sql-container" sx={{ mt: 5, mb: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              className="sql-title"
              sx={{ fontFamily: "'Josephine Sans', cursive" }}
            >
              Generated SQL Query
            </Typography>
            <Paper
              elevation={2}
              className="sql-code"
              sx={{
                backgroundColor: '#f5f5f5',
                padding: 2,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontFamily: "'Exo 2', sans-serif",
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.5,
                color: '#333',
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              <pre style={{ margin: 0 }}>{sqlQuery}</pre>
            </Paper>
          </Box>
        )}

        {results.length > 0 && (
          <TableContainer component={Paper} elevation={3} className="result-table" sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="table-header">ID</TableCell>
                  <TableCell className="table-header">Name</TableCell>
                  <TableCell className="table-header">Salary</TableCell>
                  <TableCell className="table-header">Department</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.salary}</TableCell>
                    <TableCell>{row.department}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Fade>
  );
}

export default QueryForm;
