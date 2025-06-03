//services/dbServices.js
/*import axios from "axios";

const addQuery = async function addQuery(query, response, userInfo, model, imageresponse) {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  var username = userInfo.userMail;
  console.log(username);
  const endpoint = "https://dxcbackenddev.azurewebsites.net/add-query";
  const result = await axios.post(
    endpoint,
    {
      username: username,
      model: model,
      query: query,
      response: response,
      createdAt: dateTime,
      imageresponse: imageresponse,
    },
    {
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://dxcfrontenddev.azurewebsites.net",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST",
      },
    }
  );
  console.log(result);
  return result;
};


export default addQuery;

*/
