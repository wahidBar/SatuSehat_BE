// Required modules
const { getQueryEncounter } = require("./Query/getQueryEncounter.js");
const { getQueryProcedure } = require("./Query/getQueryProcedure.js");
const { getQueryCondition } = require("./Query/getQueryCondition.js");
const { getQueryObservation } = require("./Query/getQueryObservation.js");
const { getQueryComposition } = require("./Query/getQueryComposition.js");
const path = require("path");
const fs = require("fs").promises;

// Resource Type Imports
const { EncounterResource } = require("./SetResourceType/Encounter.js");
const { ConditionResource } = require("./SetResourceType/Condition.js");
const { ProcedureResource } = require("./SetResourceType/Procedure.js");
const { ObservationResource } = require("./SetResourceType/Observation.js");
const { CompositionResource } = require("./SetResourceType/Composition.js");
const { MedicationResource } = require("./SetResourceType/Medication.js");

// Database connection pool
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "trustmedis",
  password: "Akbar112",
  port: 5432,
});

// Check database connection
const checkConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Connection to the database was successful!");
    client.release();
  } catch (err) {
    console.error("Failed to connect to the database!", err.message);
  }
};

checkConnection();

// Fetch encounter
const setEncounter = async () => {
  // 1. Mendapatkan start_time dan end_time sebagai patokan kunjungan px
  // const starttime = new Date();
  // const endtime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
  // console.log(starttime);
  // console.log(endtime)
  const formatted_start_time = "2022-09-12 00:01:00";
  const formatted_end_time = "2022-09-13 23:59:00";

  // const start_time = new Date();
  // const formatted_start_time =
  //   start_time.getFullYear() +
  //   "-" +
  //   String(start_time.getMonth() + 1).padStart(2, "0") +
  //   "-" +
  //   String(start_time.getDate()).padStart(2, "0") +
  //   " " +
  //   String(start_time.getHours()).padStart(2, "0") +
  //   ":" +
  //   String(start_time.getMinutes()).padStart(2, "0") +
  //   ":" +
  //   String(start_time.getSeconds()).padStart(2, "0");

  // const end_time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
  // const formatted_end_time =
  //   end_time.getFullYear() +
  //   "-" +
  //   String(end_time.getMonth() + 1).padStart(2, "0") +
  //   "-" +
  //   String(end_time.getDate()).padStart(2, "0") +
  //   " " +
  //   String(end_time.getHours()).padStart(2, "0") +
  //   ":" +
  //   String(end_time.getMinutes()).padStart(2, "0") +
  //   ":" +
  //   String(end_time.getSeconds()).padStart(2, "0");

  console.log(formatted_start_time);
  console.log(formatted_end_time);

  const sqlQuery = await getQueryEncounter(
    formatted_start_time,
    formatted_end_time
  );

  try {
    const result = await pool.query(sqlQuery);
    console.log("Fetched encounters: ", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error fetching encounters:", error.message);
    return [];
  }
};

// Fetch conditions
const setCondition = async (pendaftaranId) => {
  const sql = await getQueryCondition(pendaftaranId);

  try {
    const result = await pool.query(sql);
    console.log("Fetched conditions: ", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error fetching conditions:", error.message);
    return [];
  }
};

// Fetch procedures
const setProcedure = async (pendaftaranId) => {
  const sql = await getQueryProcedure(pendaftaranId);

  try {
    const result = await pool.query(sql);
    console.log("Fetched procedures: ", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error fetching procedures:", error.message);
    return [];
  }
};

// Fetch observations
const setObservation = async (pendaftaranId) => {
  const sql4 = await getQueryObservation(pendaftaranId);

  try {
    const observationResult = await pool.query(sql4);
    console.log("Fetched observations: ", observationResult.rows);
    return observationResult.rows;
  } catch (error) {
    console.error("Error fetching observations:", error.message);
    return [];
  }
};

// Other placeholder functions for consistency
const setComposition = async (pendaftaranId) => {
  const sql4 = await getQueryComposition(pendaftaranId);

  try {
    const observationResult = await pool.query(sql4);
    console.log("Fetched observations: ", observationResult.rows);
    return observationResult.rows;
  } catch (error) {
    console.error("Error fetching observations:", error.message);
    return [];
  }
};

const setMedication = async (pendaftaranId) => {
  console.log("setMedication-selesai");
};

const setMedicationRequest = async (pendaftaranId) => {
  console.log("setMedicationRequest-selesai");
};

const setMedicationDispense = async (pendaftaranId) => {
  console.log("setMedicationDispense-selesai");
};

// Function to save JSON files
const saveJsonFile = async (data, fileName) => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    const filePath = path.join(__dirname, "payload", `${fileName}.json`);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, jsonData, "utf8");

    console.log(`Data saved successfully as ${fileName}.json.`);
  } catch (error) {
    console.error("Failed to save data:", error);
    throw new Error("Failed to save data.");
  }
};

// Main execution function
async function index() {
  try {
    const encounterData = await setEncounter();

    for (let i = 0; i < encounterData.length; i++) {
      const data = encounterData[i];
      let pendaftaranId = data.pendaftaran_id;

      const LocationID = data.unit_fhir_id;
      const LocationName = data.unit_nama;
      const OrganizationID = "6ef3783b-31be-4f9e-990b-9bf4f4eaaafd";
      const No_Rujukan_Pasien = "A001";

      const conditions = await setCondition(pendaftaranId);
      const observations = await setObservation(pendaftaranId);
      const procedures = await setProcedure(pendaftaranId);
      const compositions = await setComposition(pendaftaranId);

      await setMedication(pendaftaranId);
      await setMedicationRequest(pendaftaranId);
      await setMedicationDispense(pendaftaranId);

      // PAYLOAD
      const encounterEntry = await EncounterResource(
        data,
        conditions,
        LocationID,
        LocationName,
        OrganizationID,
        No_Rujukan_Pasien
      );
      const conditionEntry = await ConditionResource(
        conditions,
        data.pasien_fhir_id,
        data.pasien_nama,
        data.pegawai_fhir_id,
        data.pegawai_nama,
        data.pendaftaran_uuid,
        data.pendaftaran_mrs,
        data.pendaftaran_lrs
      );
      const procedureEntry = await ProcedureResource(
        procedures,
        data.pasien_fhir_id,
        data.pasien_nama,
        data.pegawai_fhir_id,
        data.pegawai_nama,
        data.pendaftaran_uuid,
        data.pendaftaran_mrs,
        data.pendaftaran_lrs
      );
      const observationEntry = await ObservationResource(
        observations,
        data.pasien_fhir_id,
        data.pasien_nama,
        data.pegawai_fhir_id,
        data.pegawai_nama,
        data.pendaftaran_uuid
      );
      const compositionEntry = await CompositionResource(
        compositions,
        data.pasien_fhir_id,
        data.pasien_nama,
        data.pegawai_fhir_id,
        data.pegawai_nama,
        data.diagnosapasien_uuid,
        data.pendaftaran_mrs,
        data.pendaftaran_lrs
      );
      const medicationEntry = await MedicationResource(
        compositions,
        data.pasien_fhir_id,
        data.pasien_nama,
        data.pegawai_fhir_id,
        data.pegawai_nama,
        data.diagnosapasien_uuid
      );

      const fullPayload = {
        resourceType: "Bundle",
        type: "transaction",
        entry: [
          ...(encounterEntry ? [encounterEntry] : []),
          ...Object.values(conditionEntry || {}),
          ...Object.values(procedureEntry || {}),
          ...Object.values(observationEntry || {}),
          // ...Object.values(compositionEntry || {}),
          ...Object.values(medicationEntry || {}),
        ],
      };

      const fileName = `payload_${i + 1}`;
      await saveJsonFile(fullPayload, fileName);
    }

    console.log("All data processed successfully.");
  } catch (error) {
    console.error("An error occurred during the process: ", error);
  }
}

index();
