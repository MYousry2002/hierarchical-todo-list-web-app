import axios from 'axios';

// Since we're using the proxy added in package.json, we don't need to set the base URL here.
// Axios will automatically prepend the proxy to relative URLs.
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
