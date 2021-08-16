const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = (async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6111405090c48220f8d68952",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo quod saepe neque? Repellendus, obcaecati? Nobis fugit harum perspiciatis. Tempora facilis reiciendis recusandae sequi, consequuntur tempore doloremque nihil. Assumenda, quod quas.",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dfm7jtftw/image/upload/v1628998846/YelpCamp/b3dhm3cjhekay7vge3t5.jpg",
          filename: "YelpCamp/b3dhm3cjhekay7vge3t5",
        },
        {
          url: "https://res.cloudinary.com/dfm7jtftw/image/upload/v1628998846/YelpCamp/battcw126pp1e4r4kplr.jpg",
          filename: "YelpCamp/battcw126pp1e4r4kplr",
        },
        {
          url: "https://res.cloudinary.com/dfm7jtftw/image/upload/v1628998848/YelpCamp/wjpa90yvelcdkplprqyg.jpg",
          filename: "YelpCamp/wjpa90yvelcdkplprqyg",
        },
      ],
    });
    await camp.save();
  }
})().then(() => {
  console.log("Seeding complete");
  mongoose.connection.close();
});
