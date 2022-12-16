export const updateData = async (reqUrl, body, reqQuery, authToken) => {
  const headers = { "Content-Type": "application/json" };
  if (authToken) {
    headers.teams_auth_token = authToken;
  }

  const requestOptions = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(body)
  };

  let url = new URL(reqUrl);
  if(reqQuery){
    Object.keys(reqQuery).forEach((key) => {
      url.searchParams.append(key, reqQuery[key])
    });
  }

  const response = await fetch(url, requestOptions);

  const data = await response.json().catch((error) => {
    console.log("error", error);
    return response;
  });
  return data;
};
