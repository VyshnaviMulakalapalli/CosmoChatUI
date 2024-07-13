const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

const fs = require('fs');
const sessionsFile = './data/sessions.json';
const activityFile = './data/activity.json';

// Function to read sessions from JSON file
const readSessionsFromFile = () => {
  try {
    const sessionsData = fs.readFileSync(sessionsFile);
    return JSON.parse(sessionsData);
  } catch (error) {
    console.error('Error reading sessions file:', error);
    return {};
  }
};

// Function to write sessions to JSON file
const writeSessionsToFile = (sessions) => {
  try {
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Error writing sessions file:', error);
  }
};

// Function to read activity data from JSON file
const readActivityFromFile = () => {
  try {
    const activityData = fs.readFileSync(activityFile);
    return JSON.parse(activityData);
  } catch (error) {
    console.error('Error reading activity file:', error);
    return [];
  }
};

// Function to write activity data to JSON file
const writeActivityToFile = (activityData) => {
  try {
    fs.writeFileSync(activityFile, JSON.stringify(activityData, null, 2));
  } catch (error) {
    console.error('Error writing activity file:', error);
  }
};

let sessions = readSessionsFromFile();
let activityData = readActivityFromFile();

app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  console.log('New Message:', message, 'Session ID:', sessionId);
  const timestamp = new Date().toISOString();

  if (!sessions[sessionId]) {
    sessions[sessionId] = { messages: [], isActive: true };
  }
  sessions[sessionId].messages.push({ role: 'user', content: message, time: timestamp });
  const messagesCount = sessions[sessionId].messages.length;
  activityData.push({ sessionId, time: timestamp, messages: messagesCount });
  writeSessionsToFile(sessions);
  writeActivityToFile(activityData);

  try {
    console.log('getting response')
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: sessions[sessionId].messages,
    });
    console.log('getting response 1')
    const chatResponse = response.choices[0].message.content.trim();
    sessions[sessionId].messages.push({ role: 'assistant', content: chatResponse, time: timestamp });

    // Log activity data
    // const messagesCount = sessions[sessionId].messages.length;
    // activityData.push({ sessionId, time: timestamp, messages: messagesCount });
    const messagesCount = sessions[sessionId].messages.length;
    const activityEntry = { sessionId, time: timestamp, messages: messagesCount };
    activityData.push(activityEntry);
    console.log('New Activity Entry:', activityEntry);

    res.json({ response: chatResponse });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/end-session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (sessions[sessionId]) {
    sessions[sessionId].isActive = false;
    writeSessionsToFile(sessions);
  }
  res.status(204).send();
});

app.get('/api/activity', (req, res) => {
  console.log('Sending Activity Data:', activityData);
  res.json(activityData); // Return activityData array
});

app.get('/api/sessions', (req, res) => {
  res.json(Object.entries(sessions).map(([sessionId, session]) => ({
    sessionId,
    isActive: session.isActive,
    messagesCount: session.messages.length,
    lastMessageTime: session.messages.length > 0 ? session.messages[session.messages.length - 1].time : null,
  })));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
