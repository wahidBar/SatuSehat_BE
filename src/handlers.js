// src/handlers.js
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb://localhost:27017/RumahSakit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const organizationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  resourceType: String,
  active: Boolean,
  identifier: [
    {
      use: String,
      system: String,
      value: String,
    },
  ],
  type: [
    {
      coding: [
        {
          system: String,
          code: String,
          display: String,
        },
      ],
    },
  ],
  name: String,
  telecom: [
    {
      system: String,
      value: String,
      use: String,
    },
  ],
  address: [
    {
      use: String,
      type: String,
      line: [String],
      city: String,
      postalCode: String,
      country: String,
      extension: [
        {
          url: String,
          extension: [
            {
              url: String,
              valueCode: String,
            },
          ],
        },
      ],
    },
  ],
  partOf: {
    reference: String,
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

const User = mongoose.model("User", {
  username: String,
  password: String,
});

const secretKey = "rahasia";
const satuSehatApiUrl = "https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1";

const validate = async (decoded, request) => {
  const user = await User.findOne({ _id: decoded.id });
  return { isValid: !!user };
};

const registerUserHandler = async (request, h) => {
  const { username, password } = request.payload;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();

  return h.response({ message: "User registered successfully" });
};

const loginUserHandler = async (request, h) => {
  const { username, password } = request.payload;
  const user = await User.findOne({ username });

  if (!user) {
    return h.response({ message: "Invalid credentials" }).code(401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return h.response({ message: "Invalid credentials" }).code(401);
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: "1h",
  });

  return h.response({ token });
};

// const getRumahSakitHandler = async (request, h) => {
//   try {
//     console.log("Fetching Rumah Sakit data...");
//     const rumahSakitData = await Organization.find();
//     console.log("Fetched Rumah Sakit data:", rumahSakitData);
//     return h.response(rumahSakitData);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return h.response({ message: "Error fetching data" }).code(500);
//   }
// };

const getRumahSakitHandler = async (request, h) => {
  try {
    console.log("Fetching RS MongooDB...");
    const organizationCollection =
      mongoose.connection.db.collection("organizations");
    const locationCollection = mongoose.connection.db.collection("locations");
    const bundle1Collection = mongoose.connection.db.collection("bundle1");

    const organization = await organizationCollection.find().toArray();
    const location = await locationCollection.find().toArray();
    const bundle1 = await bundle1Collection.find().toArray();

    //delete fields ID
    organization.forEach((organization) => {
      delete organization._id;
    });
    location.forEach((location) => {
      delete location._id;
    });
    bundle1.forEach((bundle1) => {
      delete bundle1._id;
    });

    const data = { organization, location, bundle1 };

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return h.response({ message: "Error fetching data" }).code(500);
  }
};

const sendDataToSatuSehatHandler = async (request, h) => {
  try {
    const rumahsakitDb = await getRumahSakitHandler(request, h);

    const accessToken = "AMOhfhLHwBTs5ktjcwnZvC6VH5lN";

    const databundle1 = JSON.stringify(rumahsakitDb.bundle1[0]);

    console.log(databundle1);

    const bundle1 = await axios.post(`${satuSehatApiUrl}`, databundle1, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Data successfully sent to Satu Sehat API:", bundle1.data);
    return h.response({
      message: "Data sent successfully to Satu Sehat API",
      data: bundle1.data, // Fix the typo here
    });
  } catch (error) {
    console.error("Error sending data to Satu Sehat API:", error.response);
    return h
      .response({ error: error.response.data })
      .code(error.response.status || 500);
  }
};

module.exports = {
  registerUserHandler,
  loginUserHandler,
  getRumahSakitHandler,
  sendDataToSatuSehatHandler,
  validate,
};
