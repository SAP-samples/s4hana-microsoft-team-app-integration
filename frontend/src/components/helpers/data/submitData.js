export const submitData = async (url, body, authToken) => {
  const headers = { "Content-Type": "application/json" };
  if (authToken) {
    headers.teams_auth_token = authToken;
  }

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };

  const response = await fetch(url, requestOptions);

  const data = await response.json().catch((error) => {
    console.log("error in submit data: ", error);
    return response;
  });
  return data;
};
