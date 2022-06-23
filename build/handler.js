"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var express = require("express");
var jwt = require("jsonwebtoken");
var pgPromise = require("pg-promise");
require("dotenv");
var bcrypt = require("bcrypt");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var express__default = /* @__PURE__ */ _interopDefaultLegacy(express);
var jwt__default = /* @__PURE__ */ _interopDefaultLegacy(jwt);
var pgPromise__default = /* @__PURE__ */ _interopDefaultLegacy(pgPromise);
var bcrypt__default = /* @__PURE__ */ _interopDefaultLegacy(bcrypt);
const authToken = (req, res, next) => {
  try {
    let header = req.headers["authorization"];
    if (typeof header !== "undefined") {
      let bearer = header.split(":");
      const { username: username2 } = jwt__default["default"].verify(bearer[1], "This-is-my-secret-code#1");
      req.username = username2;
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
const generateAccessToken = (username2) => jwt__default["default"].sign({ username: username2 }, "This-is-my-secret-code#1", { expiresIn: "24h" });
const app = express__default["default"]();
app.use(express__default["default"].json());
app.use(express__default["default"].urlencoded({ extended: false }));
const pgp = pgPromise__default["default"]({});
const db = pgp("postgres://pgadmin:pg123@localhost:5432/hearts_app");
app.get("/api/hello", (req, res) => {
  res.json({ hello: "world" });
});
app.post("/api/v1/create/user", async (req, res) => {
  const { username: username2, password } = req.body;
  bcrypt__default["default"].hash(password, 10, async (err, hashedPassword) => {
    await db.none(`insert into love_user ( username, password, love_count) values($1,$2,$3) on conflict do nothing`, [username2, hashedPassword, 0]);
  });
  const token = generateAccessToken(username2);
  res.json({
    status: "success",
    token
  });
});
app.post("/api/v1/counter/increament", async (req, res) => {
  const { token, counter } = req.body;
  const { username: username2 } = jwt__default["default"].verify(token, "This-is-my-secret-code#1");
  console.log(req.body);
  await db.none(`update love_user set love_count = love_count + $1 where username = $2`, [counter, username2]);
});
app.get("/api/v1/auth", authToken, async (req, res) => {
  console.log(req.username);
  const verifyUser = await db.one("select * from love_user where username = $1", [req.username]);
  if (verifyUser) {
    res.json({
      status: "success",
      user: verifyUser,
      isloveUser: true
    });
  }
  res.json({
    status: "failure",
    isloveUser: false
  });
});
app.post("/api/v1/counter/decreament", async (req, res) => {
  const { token, counter } = req.body;
  const { username: username2 } = jwt__default["default"].verify(token, "This-is-my-secret-code#1");
  console.log(req.body);
  await db.none(`update love_user set love_count = love_count - $1 where username = $2`, [counter, username2]);
});
app.get("/api/v1/love/user/:user", async (req, res) => {
  const loveUser = db.oneOrNone(`select * from love_user where username = $1`, [username]);
  res.json({
    status: "success",
    user: loveUser
  });
});
app.post("/api/v1/login/user", async (req, res) => {
  const { username: username2, password } = req.body;
  console.log(req.body);
  const userHashedPassword = await db.oneOrNone(`select * from love_user where username = $1`, [username2]);
  console.log(userHashedPassword);
  bcrypt__default["default"].compare(password, userHashedPassword.password, (err, results) => {
    if (err)
      return err;
    if (results) {
      res.json({
        status: "success",
        isLoggedin: true,
        user: userHashedPassword
      });
    }
  });
});
const handler = app;
exports.handler = handler;
