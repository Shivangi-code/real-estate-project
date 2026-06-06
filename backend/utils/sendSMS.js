const axios = require("axios");

const sendSMS = async (mobile, message) => {
  try {
    const response = await axios.get(
      "https://mobilesmsapi.com/api/send_sms",
      {
        params: {
          api_token: process.env.MOBILE_SMS_API_TOKEN,
          mobile,
          message,
        },
      }
    );

    console.log("MobileSMSAPI RESPONSE:", response.data);

    return response.data;

  } catch (error) {

    console.log(
      "MobileSMSAPI ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = sendSMS;