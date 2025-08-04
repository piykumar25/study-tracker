import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export async function loginUser(payload) {
  return axios.post(`${BASE_URL}/login`, payload);
}

export async function registerUser(payload) {
  return axios.post(`${BASE_URL}/register`, payload);
}