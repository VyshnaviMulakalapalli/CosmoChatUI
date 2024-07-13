import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Container, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { getChatResponse, endSession } from '../api/openaiService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const newSessionId = Date.now();
    setSessionId(newSessionId);
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: input, type: 'user' },
    ]);
    setInput('');

    try {
      const response = await getChatResponse(input, sessionId);
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: response, type: 'ai' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: 'Error: Could not get response from AI', type: 'error' },
      ]);
    }
  };

  const terminateChat = async () => {
    try {
      await endSession(sessionId);
      setMessages([]);
      setSessionId(Date.now());
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ textAlign: 'center', margin: '20px 0' }}>Start exploring!!</Typography>
      <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column', mt: 6 }}>
        <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
          {messages.map((message, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
              <Paper
                sx={{
                  padding: 1,
                  maxWidth: '70%',
                  backgroundColor: message.type === 'user' ? '#DCF8C6' : message.type === 'ai' ? '#E0E0E0' : '#FFCDD2',
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', padding: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <IconButton color="primary" onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: 1, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="secondary" onClick={terminateChat}>
            End Chat
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatInterface;
