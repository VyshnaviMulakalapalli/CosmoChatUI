export const getUserActivity = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/activity');
      const data = await response.json();
      console.log('Fetched Activity Data:', data); 
      return data;
    } catch (error) {
      console.error('Error fetching activity data:', error);
      return [];
    }
  };
  
  export const getSessions = async () => {
    const response = await fetch('http://localhost:5000/api/sessions');
    const data = await response.json();
    return data;
  };
  