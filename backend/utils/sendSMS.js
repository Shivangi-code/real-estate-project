const axios = require("axios");

const sendSMS = async (mobile, otp) => {
  try {
    const message = `Your Housify Realty OTP is ${otp}. Do not share this OTP with anyone.`;

    const response = await axios.get(
      "https://mobilesmsapi.com/api/send_sms",
      {
        params: {
          api_token: process.env.MOBILE_SMS_API_TOKEN,
          mobile: mobile,
          message: message,
        },
      }
    );

    console.log("MobileSMSAPI Response:", response.data);

    if (!response.data.status) {
      throw new Error(response.data.msg || "SMS sending failed");
    }

    return response.data;
  } catch (error) {
    console.log(
      "MobileSMSAPI Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to send OTP SMS");
  }
};

module.exports = sendSMS;