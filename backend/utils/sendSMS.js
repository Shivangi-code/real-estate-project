const axios = require("axios");

const sendSMS = async (mobile, otp) => {
  try {
    const message = `Your Housify Realty OTP is ${otp}. Valid for 5 minutes.`;

    const response = await axios.get("https://mobilesmsapi.com/api/send_sms", {
      params: {
        api_token: process.env.MOBILE_SMS_API_TOKEN,
        mobile,
        message,
      },
    });

    console.log("MobileSMSAPI RESPONSE:", response.data);

    if (response.data && response.data.status === false) {
      throw new Error(response.data.msg);
    }

    return response.data;
  } catch (error) {
    console.log("MobileSMSAPI ERROR:", error.response?.data || error.message);

    throw error;
  }
};

module.exports = sendSMS;
