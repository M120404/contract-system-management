import axios from 'axios';

const BASE_URL = 'http://localhost:8080/subcontracts';

export const getAllSubContracts = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getSubContractById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createSubContract = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateSubContract = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteSubContract = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
