export const getChatResponse = async (input, sessionId) => {
  const response = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: input, sessionId }),
  });

  const data = await response.json();
  return data.response;
};

export const endSession = async (sessionId) => {
  await fetch(`http://localhost:5000/api/end-session/${sessionId}`, {
    method: 'DELETE',
  });
};
