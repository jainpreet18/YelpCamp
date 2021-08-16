const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const UserController = require("../controllers/users");

router
  .route("/register")
  .get(UserController.renderRegisterForm)
  .post(catchAsync(UserController.register));

router
  .route("/login")
  .get(UserController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(UserController.login)
  );

router.get("/logout", UserController.logout);

module.exports = router;
