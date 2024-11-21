// config.js
const Hapi = require("@hapi/hapi");
const sqlParser = require("sql-parser");

const initServer = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  // Using 'hapi-payload-to-stream' plugin to access raw payload
  await server.register(require("hapi-payload-to-stream"));

  return server;
};

const parsePayload = async (request) => {
  const dataBuffer = await request.payload;
  let jsonData;

  if (request.mime.type === "application/json") {
    jsonData = JSON.parse(dataBuffer.toString());
  } else if (request.mime.type === "text/csv") {
    jsonData = await csv().fromString(dataBuffer.toString());
  } else if (request.mime.type === "application/sql") {
    // Using sql-parser to read SQL file
    const sqlStatements = sqlParser.parse(dataBuffer.toString());
    // Do something with the information extracted from the SQL file
    jsonData = { sqlStatements };
  } else {
    throw new Error("Unsupported file format");
  }

  return jsonData;
};

const startServer = async (server) => {
  await server.start();
  console.log(`Server is running at ${server.info.uri}`);
};

module.exports = {
  initServer,
  parsePayload,
  startServer,
};
