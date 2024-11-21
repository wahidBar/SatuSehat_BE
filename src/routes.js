// src/routes.js
const {
  registerUserHandler,
  loginUserHandler,
  getRumahSakitHandler,
  sendDataToSatuSehatHandler,
  sendDataBundle2,
  getMBarangObat,
  getMBarangObatByID,
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
  {
    method: "POST",
    path: "/send-data-bundle2",
    handler: sendDataBundle2,
    // options: {
    //   auth: "jwt",
    // },
  },
  {
    method: "get",
    path: "/barang-obat",
    handler: getMBarangObat,
    // options: {
    //   auth: "jwt",
    // },
  },
  {
    method: "get",
    path: "/barang-obat-id",
    handler: getMBarangObatByID,
    // options: {
    //   auth: "jwt",
    // },
  },
  // getMBarangObatByID
];
