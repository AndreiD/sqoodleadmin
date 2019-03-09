import axios from 'axios';

const baseUrl = 'https://api.github.com/users/';

export const fetchData = (data) => {
  return {
    type: "FETCHED_TOKEN_DATA",
    data
  }
};

export const fetchGithubData = (username) => {
  return (dispatch) => {
    return axios.get(baseUrl + username)
      .then(response => {
        console.log('response in fetch', response)
        dispatch(fetchData(response.data))
      })
      .catch(error => {
        throw (error);
      });
  };
};
