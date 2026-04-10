const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= HASH PASSWORD =================
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};


// ================= COMPARE PASSWORD =================
exports.comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};


// ================= GENERATE TOKEN =================
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};