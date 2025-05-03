// For development inside Docker
const API_URL = import.meta.env.VITE_API_URL || 'http://http://127.0.0.1:5000';

export const fetchData = async () => {
  const res = await fetch(`${API_URL}/api`);
  const data = await res.json();
  return data;
};
