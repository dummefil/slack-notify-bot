const _ = require('lodash');
const axios = require('axios');

function requestWithBearerToken({ url, token }, requestConfig) {
  const bearerConfig = {
    headers: {
      Authorization: `Bearer ${token.token}`
    }
  }
  return request(url, _.extend(requestConfig, bearerConfig))
}

async function request(url, requestConfig, data = []) {
  console.log('Going to', url);
  try {
    const response = await axios(url, requestConfig)

    if (response.data.values) {
      data = data.concat(response.data.values);
    }

    if (response.data.next) {
      return request(response.data.next, requestConfig, data);
    }

    if (data.length) {
      return data;
    }

    if (response.data.values) {
      return response.data.values;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  request,
  requestWithBearerToken,
};
