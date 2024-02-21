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
