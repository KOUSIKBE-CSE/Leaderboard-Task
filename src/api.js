import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/users',
});

export const getUsers = (params) => API.get('/', { params });
export const getClaimHistory = (userId) => API.get(`/history/${userId}`);
export const claimPoints = (userId) => API.post(`/claim/${userId}`);
export const addUser = (data) => API.post('/add', data);
