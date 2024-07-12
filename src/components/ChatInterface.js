// src/components/ChatInterface.js
import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { getChatResponse } from '../api/openaiService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: input, type: 'user' },
    ]);
    setInput('');

    try {
      const response = await getChatResponse(input);
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

  return (
    <Container maxWidth="md">
      <h1 style={{ textAlign: 'center'}}>Start exploring!!</h1>
      <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column', mt: 6 }}>
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
      </Paper>
    </Container>
  );
};

export default ChatInterface;
