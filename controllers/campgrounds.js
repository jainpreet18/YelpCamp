const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  // console.log(campgrounds);
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const newCampground = new Campground(req.body.campground);
  newCampground.geometry = geoData.body.features[0].geometry;
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.author = req.user._id;
  await newCampground.save();
  // console.log(newCampground);
  req.flash("success", "Successfully made a new Campground!!!");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showCampgrounds = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that Campground");
    res.redirect("/campgrounds");
  }
  // console.log(campground);
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const { id } = req.params;
  // console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  campground.geometry = geoData.body.features[0].geometry;

  await campground.save();
  // console.log(campground);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated the Campground!!!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this campground!");
    return res.redirect(`/campgrounds/${id}`);
  }
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the Campground!!!");

  res.redirect("/campgrounds");
};

// module.exports.editCampground = async (req, res) => {
//   const { id } = req.params;
//   // console.log(req.body);
//   const campground = await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });
//   const imgs = req.files.map((f) => ({
//     url: f.path,
//     filename: f.filename,
//   }));
//   campground.images.push(...imgs);
//   await campground.save();
//   // console.log(campground);
//   if (req.body.deleteImages) {
//     for (let filename of req.body.deleteImages) {
//       await cloudinary.uploader.destroy(filename);
//     }
//     await campground.updateOne({
//       $pull: { images: { filename: { $in: req.body.deleteImages } } },
//     });
//   }
//   req.flash("success", "Successfully updated the Campground!!!");
//   res.redirect(`/campgrounds/${campground._id}`);
// };
