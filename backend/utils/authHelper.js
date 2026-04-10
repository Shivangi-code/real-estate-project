const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

exports.hashOtp = async (otp) => {
  return await bcrypt.hash(otp.toString(), 10);
};

exports.compareOtp = async (otp, hash) => {
  return await bcrypt.compare(otp.toString(), hash);
};