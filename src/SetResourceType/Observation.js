async function ObservationResource(
  observations,
  pasienID,
  pasienNama,
  pegawaiID,
  pegawaiNama,
  fullUrl
) {
  try {
    // Fetch conditions for the specific encounter

    // Check if conditions were found
    if (!observations || observations.length === 0) {
      return null;
    }

    // Function to create the resource structure for each condition
    const createResource = (observationItem) => {
      console.log(observationItem);
      return {
        fullUrl: "urn:uuid:" + observationItem.periksa_pendaftaran_id,
        resource: {
          resourceType: "Observation",
          status: "final",
          category: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/observation-category",
                  code: "vital-signs",
                  display: "Vital Signs",
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "8867-4",
                display: "Heart rate",
              },
            ],
          },
          subject: {
            reference: "Patient/" + String(pasienID),
            display: String(pasienNama),
          },
          encounter: {
            reference: "urn:uuid:" + String(fullUrl),
          },
          effectiveDateTime: "2023-08-31T01:10:00+00:00",
          issued: "2023-08-31T01:10:00+00:00",
          performer: [
            {
              reference: "Practitioner/" + String(pegawaiID),
              display: String(pegawaiNama),
            },
          ],
          valueQuantity: {
            value: 80,
            unit: "{beats}/min",
            system: "http://unitsofmeasure.org",
            code: "{beats}/min",
          },
        },
        request: {
          method: "POST",
          url: "Observation",
        },
      };
    };

    // Create condition resources
    const resources = observations.map(createResource);

    return resources; // Return the created condition resources
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while processing observations.");
  }
}

module.exports = { ObservationResource }; // Export the function
