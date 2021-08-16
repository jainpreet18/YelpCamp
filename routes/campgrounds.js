const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const CampgroundController = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(CampgroundController.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(CampgroundController.createCampground)
  );

router.get("/new", isLoggedIn, CampgroundController.renderNewForm);
router
  .route("/:id")
  .get(catchAsync(CampgroundController.showCampgrounds))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(CampgroundController.editCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(CampgroundController.deleteCampground)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(CampgroundController.renderEditForm)
);

module.exports = router;
