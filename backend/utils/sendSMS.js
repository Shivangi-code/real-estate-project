const axios =
  require("axios");

const sendSMS =
  async (mobile) => {

    try {

      const response =
        await axios.get(
          `https://control.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=91${mobile}&authkey=${process.env.MSG91_AUTH_KEY}`
        );

      console.log(
        "MSG91 OTP SENT ✅"
      );

      return response.data;

    } catch (error) {

      console.log(
        "MSG91 SMS ERROR:",
        error.response?.data ||
        error.message
      );

      throw new Error(
        "Failed to send OTP SMS"
      );
    }
  };

module.exports =
  sendSMS;