export const getValueHelpData = async (url, reqHeader, reqBody) => {

    let headers = { "Content-Type": "application/json" };
    if(reqHeader.authToken){
        headers.teams_auth_token = reqHeader.authToken;
    }

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(reqBody)
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
        console.log("Error in getValueHelpData: ", response.statusText);
      } else {
        const data = response.json();
        return data;
      }

}