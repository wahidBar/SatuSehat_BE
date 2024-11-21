// const Hapi = require("@hapi/hapi");
// const Inert = require("@hapi/inert");
// const Pino = require("hapi-pino");
// const fs = require("fs");
// const util = require("util");
// const routes = require("./routes");
// const {
//   getRumahSakitHandler,
//   sendDataToSatuSehatHandler,
//   convertCsvToJson,
//   readJsonFile,
//   convertSqlToJson,
// } = require("./handlers");

// const server = Hapi.server({
//   port: 8099,
//   host: "localhost",
// });

// const startServer = async () => {
//   try {
//     await server.register(Inert);

//     server.route({
//       method: "POST",
//       path: "/upload",
//       options: {
//         payload: {
//           output: "stream",
//           allow: "multipart/form-data",
//         },
//       },
//       handler: async (request, h) => {
//         const { file } = request.payload;

//         const filePath = `./uploads/${file.hapi.filename}`;
//         const fileStream = fs.createWriteStream(filePath);

//         file.pipe(fileStream);

//         return new Promise((resolve, reject) => {
//           file.on("end", async (err) => {
//             if (err) {
//               return reject(err);
//             }

//             const fileType = file.hapi.headers["content-type"];

//             try {
//               let data;

//               if (fileType.includes("csv")) {
//                 data = await convertCsvToJson(filePath);
//               } else if (fileType.includes("json")) {
//                 data = await readJsonFile(filePath);
//               } else if (fileType.includes("sql")) {
//                 data = await convertSqlToJson(filePath);
//               }

//               // TODO: Send data to API

//               console.log(data);
//               resolve({ status: "File uploaded and processed successfully" });
//             } catch (error) {
//               reject(error);
//             }
//           });

//           file.on("error", (err) => reject(err));
//         });
//       },
//     });

//     await server.start();
//     console.log("Server running on %s", server.info.uri);
//   } catch (err) {
//     console.error("Error starting server: ", err);
//     process.exit(1);
//   }
// };

// server.route(routes);

// startServer();

const Hapi = require("@hapi/hapi");
// const FhirServer = require("hapi-fhir"); // Import the FhirServer module
const routes = require("./routes");

const server = Hapi.server({
  port: 8099,
  host: "localhost",
});

const startServer = async () => {
  // await server.register({
  //   plugin: FhirServer,
  //   options: {
  //     models: {
  //       Encounter: require("./models/organization"),
  //     },
  //     base: "/fhir",
  //   },
  // });
  try {
    await server.start();
    console.log("Server running on %s", server.info.uri);
  } catch (err) {
    console.error("Error starting server: ", err);
    process.exit(1);
  }
};

server.route(routes);

startServer();
