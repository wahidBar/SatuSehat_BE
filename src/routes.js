// src/routes.js
const {
  registerUserHandler,
  loginUserHandler,
  getRumahSakitHandler,
  sendDataToSatuSehatHandler,
} = require("./handlers");

module.exports = [
  {
    method: "POST",
    path: "/register",
    handler: registerUserHandler,
  },
  {
    method: "POST",
    path: "/login",
    handler: loginUserHandler,
  },
  {
    method: "GET",
    path: "/rs-organizations",
    handler: getRumahSakitHandler,
    // options: {
    //   auth: "jwt",
    // },
  },
  {
    method: "POST",
    path: "/send-data-to-satu-sehat",
    handler: sendDataToSatuSehatHandler,
    // options: {
    //   auth: "jwt",
    // },
  },
];
