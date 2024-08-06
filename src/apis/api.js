import axios from '../axios.config'

export const loginAPI = async (data) => {
    const url = "/authen/api/v1/auth/login";
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

export const registerAPI = async (data) => {
  const url = "/register";
  return axios.post(url, data);
};


export const speechToText = async (formData, token) => {
  const url = "/on-premise/v1/convert/via-upload-max-duration";
  try{
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  }catch(error){
    return error
  }
};

export const userInfo = async (credentials) => {
  const url = '/on-premise/v1/account/me';
  const { token } = credentials;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async (data) => {
  const url = "/logout";
  return axios.post(url, JSON.stringify({'token':data}),{
    headers: {
      // Overwrite Axios's automatically set Content-Type
      'Content-Type': 'application/json'
    }
  }).then(
    response => {

    }
  );
}

axios.interceptors.response.use(response => {
  return response;
}, error => {
 if (error.response.status === 401) {
  //place your reentry code
  console.log('intercept 401')
 }
 return error;
});

export const checkValidToken = async (data) => {
  const url = "/check_token";
  return axios.post(url, data)
};

export const saveLogs = async (data, token) => {
  const url = "/on-premise/v1/logs";
  try{
    const headers = {
      'Authorization': `Bearer ${token}`, // Hoặc 'Bearer ' + token, tùy theo yêu cầu của API
      'Content-Type': 'application/json' // Đảm bảo gửi dữ liệu dưới dạng JSON
    };
    const response = await axios.post(url, data, {headers})
    return response;
  }catch(err){
    return err;
  }
  
};

export const getListAudio = async (credentials) => {
  const url = "/on-premise/v1/logs?limit=100&offset=0";
  const { token } = credentials;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    //throw error;
    return error;
  }
};
//DM tài khoản//
export const getListTaiKhoan = async (credentials) => {
  const url = 'api/account/list-account?limit=10&offset=0';
  const { token } = credentials;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const resetMatKhau = async (credentials, account_id) => {
  const url = 'account/reset-password/:' + account_id;
  const { token } = credentials;

  try {
    const response = await axios.put(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
