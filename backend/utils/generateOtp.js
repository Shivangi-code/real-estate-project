const crypto =
  require("crypto");

// ======================================================
// ================= GENERATE OTP =======================
// ======================================================

function generateOtp() {

  return crypto
    .randomInt(
      100000,
      999999
    )
    .toString();
}

module.exports =
  generateOtp;