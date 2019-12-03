export const formatPostData = data => {
  const params = new URLSearchParams();

  for (let [k, v] of Object.entries(data)) {
    console.log('Key:', k, 'Value:', v);
    params.append(k, v);
  }

  return params;
};
