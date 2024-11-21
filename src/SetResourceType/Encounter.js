async function EncounterResource(
  data, 
  conditions,
  LocationID,
  LocationName,
  OrganizationID,
  No_Rujukan_Pasien
  ) {
  console.log(data);
  const formatDateToISO = (dateString) => {
    const date = new Date(dateString); // Membuat objek Date dari string
    return date.toISOString(); // Mengonversi ke format ISO 8601
  };

  try {
    const encounterItem = data;

    const SetEncounter = () => {
      const resource = {
        fullUrl: "urn:uuid:" + String(encounterItem.pendaftaran_uuid),
        resource: {
          resourceType: "Encounter",
          identifier: [
            {
              system: "http://sys-ids.kemkes.go.id/encounter/"+ String(OrganizationID),
              value: String(encounterItem.pendaftaran_no),
            },
          ],
          status: "finished",
          statusHistory: [
            {
              status: "arrived",
              period: {
                start: formatDateToISO(encounterItem.pendaftaran_mrs),
                end: formatDateToISO(encounterItem.pendaftaran_mrs),
              },
            },
            {
              status: "in-progress",
              period: {
                start: formatDateToISO(encounterItem.pendaftaran_krs),
                end: formatDateToISO(encounterItem.pendaftaran_krs),
              },
            },
            {
              status: "finished",
              period: {
                start: formatDateToISO(encounterItem.pendaftaran_lrs),
                end: formatDateToISO(encounterItem.pendaftaran_lrs),
              },
            },
          ],
          class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory",
          },
          subject: {
            reference: String("Patient/" + encounterItem.pasien_fhir_id),
            display: String(encounterItem.pasien_nama),
          },
          participant: [
            {
              type: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                      code: "ATND",
                      display: "attender",
                    },
                  ],
                },
              ],
              individual: {
                reference: String(
                  "Practitioner/" + encounterItem.pegawai_fhir_id
                ),
                display: String(encounterItem.pegawai_nama),
              },
            },
          ],
          period: {
            start: String(encounterItem.pendaftaran_mrs),
            end: String(encounterItem.pendaftaran_mrs),
          },
          hospitalization: {
            dischargeDisposition: {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/discharge-disposition",
                  code: "oth",
                  display: "other-hcf",
                },
              ],
              text: "Rujukan ke RSUP Fatmawati dengan nomor rujukan "+ String(No_Rujukan_Pasien),
            },
          },
          location: [
            {
              extension: [
                {
                  extension: [
                    {
                      url: "value",
                      valueCodeableConcept: {
                        coding: [
                          {
                            system:
                              "http://terminology.kemkes.go.id/CodeSystem/locationServiceClass-Outpatient",
                            code: "reguler",
                            display: "Kelas Reguler",
                          },
                        ],
                      },
                    },
                    {
                      url: "upgradeClassIndicator",
                      valueCodeableConcept: {
                        coding: [
                          {
                            system:
                              "http://terminology.kemkes.go.id/CodeSystem/locationUpgradeClass",
                            code: "kelas-tetap",
                            display: "Kelas Tetap Perawatan",
                          },
                        ],
                      },
                    },
                  ],
                  url: "https://fhir.kemkes.go.id/r4/StructureDefinition/ServiceClass",
                },
              ],
              location: {
                reference: "Location/"+ String(LocationID),
                display: String(LocationName),
              },
              period: {
                start: "2023-08-31T00:00:00+00:00",
                end: "2023-08-31T02:00:00+00:00",
              },
            },
          ],
          serviceProvider: {
            reference: "Organization/"+ String(OrganizationID),
          },
        },
        request: {
          method: "POST",
          url: "Encounter",
        },
      };

      // Add diagnosis if conditions exist
      if (Array.isArray(conditions) && conditions.length > 0) {
        resource.resource.diagnosis = conditions.map(
          (conditionItem, index) => ({
            condition: {
              reference:
                "urn:uuid:" + String(conditionItem.diagnosapasien_uuid),
              display: String(conditionItem.icd_nama),
            },
            use: {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/diagnosis-role",
                  code: "DD",
                  display: "Discharge diagnosis",
                },
              ],
            },
            rank: index + 1,
          })
        );
      }

      return resource;
    };

    if (!encounterItem) {
      throw new Error("No encounter item provided.");
    }

    return SetEncounter(); // Return the encounter resource
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while processing the encounter.");
  }
}

module.exports = { EncounterResource }; // Export the function
