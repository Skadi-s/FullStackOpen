import axios from 'axios';

const baseUrl = 'https://phonebook-backend-v74n.onrender.com/api/persons';

const getAll = () => {
  return axios.get(baseUrl);
};

const create = newObject => {
  return axios.post(baseUrl, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAll,
  create,
  update,
  deletePerson
};
