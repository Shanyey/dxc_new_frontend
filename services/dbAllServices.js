//services/dbServices.js
import axios from "axios";

const addAllQueries = async function addAllQueries(query, response, userInfo, model, imageData) {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  var username = userInfo.userMail;
  console.log(username);
  // const endpoint = "https://dxcbackend.azurewebsites.net/add-all-query";
  const endpoint = "http://127.0.0.1:5000/add-all-query";
  const result = await axios.post(
    endpoint,
    {
      username: username,
      model: model,
      query: query,
      response: response,
      createdAt: dateTime,
      imageresponse: imageData,
    },
    {
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "https://dxcfrontend2.azurewebsites.net",
        "Access-Control-Allow-Origin": "http://localhost:5173/",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST",
      },
    }
  );
  console.log(result);
  return result;
};

export default addAllQueries;
