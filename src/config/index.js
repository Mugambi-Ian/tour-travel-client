import config from "./config";

const firebase = require("firebase/compat/app").default;

require("firebase/compat/database");
require("firebase/compat/analytics");
require("firebase/compat/storage");
require("firebase/compat/auth");

firebase.initializeApp(config());
firebase.analytics();

export const _firebase = firebase;
export const _database = firebase.database();
export const _storage = firebase.storage();
export const _auth = firebase.auth();

export const validField = (x) => {
  return x.length !== 0;
};

export const validFields = (x) => {
  for (let i = 0; i < x.length; i++) {
    if (!validField(x[i])) {
      return false;
    }
  }
  return true;
};

export function formatNumber(x) {
  x = parseFloat(x).toFixed(2);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function validateEmail(mail) {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      mail
    )
  ) {
    return true;
  }
  return false;
}
