import React, { useState, useEffect } from 'react';
import { Paper, Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUserActivity, getSessions } from '../api/dashboardService';

// Function to calculate messages count per day
const calculateMessagesPerDay = (activityData) => {
  const messagesPerDay = {};
  activityData.forEach(entry => {
    const date = new Date(entry.time).toLocaleDateString();
    if (!messagesPerDay[date]) {
      messagesPerDay[date] = 0;
    }
    messagesPerDay[date] += 1;
  });
  return Object.entries(messagesPerDay).map(([date, messages]) => ({ date, messages }));
};

const Dashboard = () => {
  const [activityData, setActivityData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messagesPerDay, setMessagesPerDay] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const activityData = await getUserActivity();
      console.log('Activity Data:', activityData);
      setActivityData(activityData);
      const sessionsData = await getSessions();
      console.log('Sessions Data:', sessionsData);
      setSessions(sessionsData);

      // Calculate messages per day from activityData
      const messagesPerDay = calculateMessagesPerDay(activityData);
      setMessagesPerDay(messagesPerDay);
    };
    fetchData();
  }, []);

  const activeSessions = sessions.filter(session => session.isActive);
  const endedSessions = sessions.filter(session => !session.isActive);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ textAlign: 'center', margin: '20px 0' }}>User Activity Dashboard</Typography>
      <Paper elevation={3} sx={{ height: '70vh', padding: 2, marginBottom: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={messagesPerDay}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="messages" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Typography variant="h5" style={{ marginBottom: '10px' }}>Active Chats</Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <List>
          {activeSessions.map((session) => (
            <div key={session.sessionId}>
              <ListItem>
                <ListItemText
                  primary={`Session ID: ${session.sessionId}`}
                  secondary={`Messages: ${session.messagesCount}, Last Active: ${new Date(session.lastMessageTime).toLocaleString()}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
      <Typography variant="h5" style={{ marginBottom: '10px' }}>Ended Chats</Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {endedSessions.map((session) => (
            <div key={session.sessionId}>
              <ListItem>
                <ListItemText
                  primary={`Session ID: ${session.sessionId}`}
                  secondary={`Messages: ${session.messagesCount}, Last Active: ${new Date(session.lastMessageTime).toLocaleString()}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Dashboard;
