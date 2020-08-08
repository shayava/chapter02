"use strict";
const uuid = require("uuid");
module.exports = function (req, res, next) {
  //req.cookies.userId = "";
  //   let userId = req.cookie.userId;
  //   if (!userId) {
  //     userId = uuid.v4();
  //     res.cookie("userId", userId);
  //   }
  //   req.user = {
  //     id: userId,
  //   };
  next();
};
