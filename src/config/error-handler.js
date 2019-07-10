module.exports.msg = {
  success: { status: 1, statusText: "success" },
  error: { status: 2, statusText: "error" },
  exist: { status: 3, statusText: "exist" },
  not_exist: { status: 4, statusText: "not exist" },
  locked: { status: 5, statusText: "locked" },
  wrong: { status: 6, statusText: "wrong" },
  invalid_token: { status: 7, statusText: "invalid token" }
};

module.exports.handle = function (err, req, res, next) {
  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Invalid Token" });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
};
