export const getChatResponse = async (input) => {
  const response = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: input }),
  });

  const data = await response.json();
  return data.response;
};
