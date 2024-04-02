export const LOADING = "APP/LOADING";
export const IS_LOGGED_IN = "APP/IS_LOGGED_IN";
export const RESET_STORE = "APP/RESET_STORE";
export const SAVE_USER_DETAILS = "APP/SAVE_USER_DETAILS";
import { BASE_URL } from '../constant/api'
import axios from "axios";

export const actions = {
  setLoader: (value = false) => ({
    type: LOADING,
    loading: value
  }),
  setLoggedIn: (value = false) => ({
    type: IS_LOGGED_IN,
    data: value,
    storage: 'local'
  }),
  setUserDetails: (value = {}) => ({
    type: SAVE_USER_DETAILS,
    data: value,
    storage: 'local'
  }),
  resetStore: (value = {}) => ({
    type: RESET_STORE,
    data: value,
    storage: 'local'
  }),
  signIn: (data) => dispatch => {
    console.log(data, BASE_URL + '/users/login');
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'post',
        url: `${BASE_URL}/users/login`,
        data: data
      }).then(response => {
        console.log('login response ----', response.data);
        resolve(response.data);
      }).catch(error => {
        console.log('error ---', error);
        reject(error)
      });
    })

    // (BASE_URL + '/users/login', data).;
  },
  getUserDetails: (headers) => dispatch => {
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'get',
        url: `${BASE_URL}/users/details`,
        headers: { ...headers }
      }).then(response => {
        console.log(response);
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.get(BASE_URL + '/users/details', { headers })

    });
  },
  getIncidentCount: (data, headers) => dispatch => {
    let param = '';
    for (var key of Object.keys(data)) {
      console.log(key + " -> " + data[key])
      param = param + `?${key}=${data[key]}`;
      console.log(param);

    }
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'get',
        url: `${BASE_URL}/incidents/count${param}`,
        headers: { ...headers }
      }).then(response => {
        console.log('incidents res', response.data);
        resolve(response.data);
      }).catch(error => {
        console.log('incidents err', error);
        reject(error);
      })
      // axios.get(BASE_URL + '/incidents/count' + param, { headers });
    });
  },
  changePassword: (data, headers) => dispatch => {
    console.log(data, headers);
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'post',
        url: `${BASE_URL}/users/changepassword`,
        data: data,
        headers: { ...headers }
      }).then(response => {
        console.log(response);
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.put(BASE_URL + '/users/changepassword', data, { headers })
    });
  },
  forgotPassword: (data) => dispatch => {
    console.log(data);
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'put',
        url: `${BASE_URL}/users/forgetpassword`,
        data: data,
        // headers: { ...headers }
      }).then(response => {
        console.log(response);
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.put(BASE_URL + '/users/forgetpassword', data)
    });
  },
  getIncidentList: (data, headers) => dispatch => {
    let param = '';
    if (data) {
      for (var key of Object.keys(data)) {
        console.log(key + " +++++++++-> " + data[key])
        if(typeof(data[key]) === 'object'){
          const innerObjKey = Object.keys(data[key]);
          for (let index = 0; index < innerObjKey.length; index++) {
            param = param + `&${innerObjKey[index]}=${data[key][innerObjKey[index]]}`;
          }
        }else{
          param = param + `&${key}=${data[key]}`;
        }
        console.log(param);
      }
    }
    param = param.substring(1);

    console.log('get list --->>>>', data)
    console.log('get list 1--->>>>', JSON.stringify(param))
    console.log('list ----+++++++', JSON.stringify(`${BASE_URL}/incidents/all${data ? '?' + param : ''}`));
    console.log('token ------->>>>', headers)

    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'get',
        url: `${BASE_URL}/incidents/all${data ? '?' + param : ''}`,
        // data: data,
        headers: { ...headers }
      }).then(response => {
        console.log('-------+++++++++', response);
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.get(BASE_URL + '/incidents/all' + `${data ? '?' + param : ''}`, { headers })
    });
  },
  getIncidentDetails: (data, headers) => dispatch => {
    console.log('')
    return new Promise(function (resolve, reject) {
      return axios({
        method: 'get',
        url: `${BASE_URL}/incidents/${data}`,
        // data: data,
        headers: { ...headers }
      }).then(response => {
        console.log('----- incident detail++', data, JSON.stringify(response.data));
        resolve(response.data);
      }).catch(error => {
        console.log('error ----++++++', data, JSON.stringify(error))
        reject(error);
      })
      // axios.get(BASE_URL + '/incidents/' + data, { headers });
    });
  },
  getLocation: (data, headers) => dispatch => {
    let param = '';
    if (data) {
      for (var key of Object.keys(data)) {
        console.log(key + " -> " + data[key])
        param = param + `&${key}=${data[key]}`;
        console.log(param);
      }
    }
    param = param.substring(1);
    return new Promise(function (resolve, reject) {
      return axios({
        method: 'get',
        url: `${BASE_URL}/incidents/location/${data ? '?' + param : ''}`,
        // data: data,
        headers: { ...headers }
      }).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.get(BASE_URL + '/incidents/location' + `${data ? '?' + param : ''}`, { headers })
    });
  },
  getMasterData: (data, headers) => dispatch => {
    let param = '';
    if (data) {
      for (var key of Object.keys(data)) {
        console.log(key + " -> " + data[key])
        param = param + `&${key}=${data[key]}`;
        console.log(param);
      }
    }
    param = param.substring(1);
    return new Promise(function (resolve, reject) {
      return axios({
        method: 'get',
        url: `${BASE_URL}/incidents/masterdata/${data ? '?' + param : ''}`,
        // data: data,
        headers: { ...headers }
      }).then(response => {
          console.log('master data ++', JSON.stringify(response.data));
          resolve(response.data);
        }).catch(error => {
        reject(error);
      });
      // axios.get(BASE_URL + '/incidents/masterdata' + `${data ? '?' + param : ''}`, { headers })
    });
  },
  createIncident: (data, headers) => dispatch => {
    return new Promise(function (resolve, reject) {
      return axios({
        method: 'post',
        url: `${BASE_URL}/incidents/new`,
        data: data,
        headers: { ...headers }
      }).then(response => {
        console.log(response);
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.post(BASE_URL + '/incidents/new', data, { headers })
    });
  },
  sos: (data, headers) => dispatch => {
    let param = '';
    if (data) {
      for (var key of Object.keys(data)) {
        console.log(key + " -> " + data[key])
        param = param + `&${key}=${data[key]}`;
        console.log(param);
      }
    }
    param = param.substring(1);
    return new Promise(function (resolve, reject) {
      return axios({
        method: 'get',
        url: `${BASE_URL}/incidents/sos/${data ? '?' + param : ''}`,
        // data: data,
        headers: { ...headers }
      }).then(response => {
        console.log(response);
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.get(BASE_URL + '/incidents/sos' + `${data ? '?' + param : ''}`, { headers })
    });
  },
  updateUser: (data, headers) => dispatch => {
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'put',
        url: `${BASE_URL}/users/update`,
        data: data,
        headers: { ...headers }
      }).then(response => {
        console.log(response);
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.put(BASE_URL + '/users/update', data, { headers })
    });
  },
  submitRMcomment: (data, headers) => dispatch => {
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'post',
        url: `${BASE_URL}/incidents/manager/comment`,
        data: data,
        headers: { ...headers }
      }).then(response => {
        console.log(response);
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
      // axios.post(BASE_URL + '/incidents/manager/comment', data, { headers })
    });
  },
  submitSHcomment: (data, headers) => dispatch => {
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'post',
        url: `${BASE_URL}/incidents/safetyhead/comment`,
        data: data,
        headers: { ...headers }
      }).then(
        response => {
          console.log(response);
          resolve(response.data);
        }).catch(error => {
          reject(error);
        });
      // axios.post(BASE_URL + '/incidents/safetyhead/comment', data, { headers })
    });
  },
  updateIncident: (id, data, headers) => dispatch => {
    return new Promise(async function (resolve, reject) {
      return axios({
        method: 'post',
        url: `${BASE_URL}/incidents/${id}`,
        data: data,
        headers: { ...headers }
      }).then(
        response => {
          console.log(response);
          resolve(response.data);
        }
      ).catch(error => {
        reject(error);
      });
      // axios.put(BASE_URL + '/incidents/' + `${id}`, data, { headers })
    });
  },
};
