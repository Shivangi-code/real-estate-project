const bcrypt = require("bcryptjs");

// ================= HASH OTP =================
exports.hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp.toString(), salt);
};

// ================= COMPARE OTP =================
exports.compareOtp = async (enteredOtp, hashedOtp) => {
  return await bcrypt.compare(enteredOtp.toString(), hashedOtp);
};