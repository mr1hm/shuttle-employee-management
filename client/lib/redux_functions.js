export const formatPostData = data => {
  if (data) {
    const params = new URLSearchParams();

    for (let [k, v] of Object.entries(data)) {
      params.append(k, v);
    }

    return params;
  }
  return null;
};

export const throwApiError = (error, defaultMessage) => {
  let message = defaultMessage;

  if (error.response && error.response.data) {
    const { data } = error.response;
    if (data.error) {
      message = data.error;
    } else if (data.errors) {
      if (Array.isArray(data.errors)) {
        message = data.errors[0] || defaultMessage;
      } else if (typeof data.errors === 'string') {
        message = data.errors;
      }
    }
  }

  throw new Error(message);
};
