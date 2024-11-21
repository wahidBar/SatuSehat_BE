// src/handlers.js
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const path = require("path"); // Menambahkan modul path
const fs = require("fs");
const organization = require("./database/models/organization");
const dataBundle2 = require("./database/models/encounter");
const { BundleSchema } = require("./schemas/bundle2");

mongoose.connect("mongodb://localhost:27017/RumahSakit", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const pool = new Pool({
  user: "ts_product",
  host: "10.87.100.4",
  database: "cloud_hospital_copy",
  password: "ts_product",
  port: 5432, // default PostgreSQL port
});

// Test the database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error("Unable to connect to the database:", err);
  } else {
    console.log("Connected to PostgreSQL database");
    done(); // Release the client back to the pool
  }
});

const getMBarangObat = async (request, data) => {
  try {
    console.log("Fetching Obat PostgreeSQL...");
    const result = await pool.query("SELECT * FROM m_barang_obat");
    return result.rows;
  } catch (error) {
    console.error("Error fetching data:", error);
    return h.response({ message: "Error fetching data" }).code(500);
  }
};

const getMBarangObatByID = async (request, data) => {
  try {
    console.log("Fetching Obat by name PostgreeSQL...");
    const { userId } = request.query;
    const filePrefix = `${userId}_m_barang_obat_wahid`; // Menyusun bagian awal nama file berdasarkan ID pengguna

    // Array ekstensi file yang didukung
    const supportedExtensions = [".json", ".csv", ".sql"];

    let fileContent;
    let fileExtension;
    let jsonData;

    // Mencari file dengan ekstensi yang didukung
    for (const ext of supportedExtensions) {
      const filePath = path.join(
        process.cwd(),
        // "..",
        "uploads",
        filePrefix + ext
      );

      // Memeriksa apakah file ada
      if (fs.existsSync(filePath)) {
        fileContent = fs.readFileSync(filePath, "utf8");
        fileExtension = ext;
        break;
      }
    }

    console.log(fileContent);

    // Jika file tidak ditemukan
    if (!fileContent) {
      return h.response({ message: "File tidak ditemukan" }).code(404);
    }

    switch (fileExtension) {
      case ".json":
        jsonData = JSON.parse(fileContent);
        break;
      case ".csv":
        // Contoh logika konversi CSV ke JSON, Anda mungkin perlu menggunakan pustaka seperti csv-parser
        jsonData = csvToJSON(fileContent);
        break;
      case ".sql":
        // Contoh logika konversi SQL ke JSON, Anda mungkin perlu menggunakan pustaka yang sesuai
        jsonData = sqlToJSON(fileContent);
        break;
      default:
        return h.response({ message: "Format file tidak didukung" }).code(400);
    }
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return h.response({ message: "Error fetching data" }).code(500);
  }
};

const csvToJSON = (csvData) => {
  // Implementasi logika konversi CSV ke JSON
  // Anda dapat menggunakan pustaka seperti csv-parser untuk memudahkan konversi
  // Ini hanya contoh sederhana
  return csvData.split("\n").map((row) => row.split(","));
};

const sqlToJSON = (sqlData) => {
  // Implementasi logika konversi SQL ke JSON
  // Ini hanya contoh sederhana
  return sqlData.split(";").map((statement) => statement.trim());
};

// const organizationSchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   resourceType: String,
//   active: Boolean,
//   identifier: [
//     {
//       use: String,
//       system: String,
//       value: String,
//     },
//   ],
//   type: [
//     {
//       coding: [
//         {
//           system: String,
//           code: String,
//           display: String,
//         },
//       ],
//     },
//   ],
//   name: String,
//   telecom: [
//     {
//       system: String,
//       value: String,
//       use: String,
//     },
//   ],
//   address: [
//     {
//       use: String,
//       type: String,
//       line: [String],
//       city: String,
//       postalCode: String,
//       country: String,
//       extension: [
//         {
//           url: String,
//           extension: [
//             {
//               url: String,
//               valueCode: String,
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   partOf: {
//     reference: String,
//   },
// });

// const Organization = mongoose.model("Organization", organizationSchema);

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

const getRumahSakitHandler = async (request, data) => {
  try {
    console.log("Fetching RS MongooDB...");
    const getCollection = mongoose.connection.db.collection(data);

    const collection = await getCollection.find().toArray();

    collection.forEach((collection) => {
      delete collection._id;
    });

    return collection;
  } catch (error) {
    console.error("Error fetching data:", error);
    return h.response({ message: "Error fetching data" }).code(500);
  }
};

const sendDataToSatuSehatHandler = async (request, h) => {
  const { data } = request.query;
  const rumahsakitDb = await getRumahSakitHandler(request, data);

  try {
    const accessToken = "NkCJIitXCLpklPw3cxYAt3phgMAZ";

    const collectionData = rumahsakitDb[0];
    console.log(data);

    let url = "";
    if (!data.includes("Bundle")) {
      url = `${satuSehatApiUrl}/${data}`;
    } else {
      url = `${satuSehatApiUrl}`;
    }
    const collection = await axios.post(url, collectionData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (
      collection.status === 200 ||
      collection.status === 201 ||
      collection.status === 202
    ) {
      console.log("Data successfully sent to Satu Sehat API:", collection.data);

      // No need to define a schema here
      const GeneralModel = mongoose.model(
        data + "_response",
        new mongoose.Schema({}, { strict: false })
      );

      // Save data to MongoDB
      const dataToSave = collection.data;
      const newData = new GeneralModel(dataToSave);
      await newData.save();

      return h.response({
        message: "Data sent successfully to Satu Sehat API",
        Data: collection.data,
      });
    } else {
      console.error(
        "Error sending data to Satu Sehat API. Status:",
        collection.status
      );
      return h
        .response({
          error: `Failed to send data to Satu Sehat API. Status: ${collection.status}`,
        })
        .code(collection.status);
    }
  } catch (error) {
    console.error("Error sending data to Satu Sehat API:", error.response);
    return h
      .response({
        error: error.response ? error.response.data : "Internal Server Error",
      })
      .code(error.response ? error.response.status || 500 : 500);
  }
};

const sendDataBundle2 = async (request, h) => {
  const data = await dataBundle2;
  const validationResult = BundleSchema.safeParse(data);

  if (!validationResult.success) {
    return h.response(validationResult.error.errors).code(400);
  }
  try {
    const accessToken = "byMKM3f372WGCtZMP9PkJDMOtrNO";
    const url = satuSehatApiUrl;
    const collection = await axios.post(url, validationResult.data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (
      collection.status === 200 ||
      collection.status === 201 ||
      collection.status === 202
    ) {
      console.log("Data successfully sent to Satu Sehat API:", collection.data);

      // No need to define a schema here
      const GeneralModel = mongoose.model(
        data + "_response",
        new mongoose.Schema({}, { strict: false })
      );

      // Save data to MongoDB
      const dataToSave = collection.data;
      const newData = new GeneralModel(dataToSave);
      await newData.save();

      return h.response({
        message: "Data sent successfully to Satu Sehat API",
        Data: collection.data,
      });
    } else {
      console.error(
        "Error sending data to Satu Sehat API. Status:",
        collection.status
      );
      return h
        .response({
          error: `Failed to send data to Satu Sehat API. Status: ${collection.status}`,
        })
        .code(collection.status);
    }
  } catch (error) {
    console.error("Error sending data to Satu Sehat API:", error.response);
    return h
      .response({
        error: error.response ? error.response.data : "Internal Server Error",
      })
      .code(error.response ? error.response.status || 500 : 500);
  }
};

module.exports = {
  registerUserHandler,
  loginUserHandler,
  getRumahSakitHandler,
  sendDataToSatuSehatHandler,
  validate,
  getMBarangObat,
  getMBarangObatByID,
  sendDataBundle2,
};
