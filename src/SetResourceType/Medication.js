async function MedicationResource(
  medications,
  pasienID,
  pasienNama,
  pegawaiID,
  pegawaiNama,
  fullUrl,
  start,
  end
) {
  try {
    if (!medications || medications.length === 0) {
      return null;
    }

    // formated date
    const formatDateToISO = (dateString) => {
      const date = new Date(dateString); // Membuat objek Date dari string
      return date.toISOString(); // Mengonversi ke format ISO 8601
    };

    const createResource = (medicationItem) => {
      console.log(medicationItem);
      return {
        fullUrl: "urn:uuid:{{Medication_forRequest}}",
        resource: {
          resourceType: "Medication",
          meta: {
            profile: [
              "https://fhir.kemkes.go.id/r4/StructureDefinition/Medication",
            ],
          },
          extension: [
            {
              url: "https://fhir.kemkes.go.id/r4/StructureDefinition/MedicationType",
              valueCodeableConcept: {
                coding: [
                  {
                    system:
                      "http://terminology.kemkes.go.id/CodeSystem/medication-type",
                    code: "NC",
                    display: "Non-compound",
                  },
                ],
              },
            },
          ],
          identifier: [
            {
              use: "official",
              system: "http://sys-ids.kemkes.go.id/medication/{{Org_ID}}",
              value: "123456789",
            },
          ],
          code: {
            coding: [
              {
                system: "http://sys-ids.kemkes.go.id/kfa",
                code: "93001019",
                display:
                  "Rifampicin 150 mg / Isoniazid 75 mg / Pyrazinamide 400 mg / Ethambutol 275 mg Tablet Salut Selaput (KIMIA FARMA)",
              },
            ],
          },
          status: "active",
          manufacturer: {
            reference: "Organization/900001",
          },
          form: {
            coding: [
              {
                system:
                  "http://terminology.kemkes.go.id/CodeSystem/medication-form",
                code: "BS023",
                display: "Kaplet Salut Selaput",
              },
            ],
          },
          ingredient: [
            {
              itemCodeableConcept: {
                coding: [
                  {
                    system: "http://sys-ids.kemkes.go.id/kfa",
                    code: "91000330",
                    display: "Rifampin",
                  },
                ],
              },
              isActive: true,
              strength: {
                numerator: {
                  value: 150,
                  system: "http://unitsofmeasure.org",
                  code: "mg",
                },
                denominator: {
                  value: 1,
                  system:
                    "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                  code: "TAB",
                },
              },
            },
            {
              itemCodeableConcept: {
                coding: [
                  {
                    system: "http://sys-ids.kemkes.go.id/kfa",
                    code: "91000328",
                    display: "Isoniazid",
                  },
                ],
              },
              isActive: true,
              strength: {
                numerator: {
                  value: 75,
                  system: "http://unitsofmeasure.org",
                  code: "mg",
                },
                denominator: {
                  value: 1,
                  system:
                    "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                  code: "TAB",
                },
              },
            },
            {
              itemCodeableConcept: {
                coding: [
                  {
                    system: "http://sys-ids.kemkes.go.id/kfa",
                    code: "91000329",
                    display: "Pyrazinamide",
                  },
                ],
              },
              isActive: true,
              strength: {
                numerator: {
                  value: 400,
                  system: "http://unitsofmeasure.org",
                  code: "mg",
                },
                denominator: {
                  value: 1,
                  system:
                    "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                  code: "TAB",
                },
              },
            },
            {
              itemCodeableConcept: {
                coding: [
                  {
                    system: "http://sys-ids.kemkes.go.id/kfa",
                    code: "91000288",
                    display: "Ethambutol",
                  },
                ],
              },
              isActive: true,
              strength: {
                numerator: {
                  value: 275,
                  system: "http://unitsofmeasure.org",
                  code: "mg",
                },
                denominator: {
                  value: 1,
                  system:
                    "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                  code: "TAB",
                },
              },
            },
          ],
        },
        request: {
          method: "POST",
          url: "Medication",
        },
      };
    };

    // Create condition resources
    const resources = medications.map(createResource);

    return resources; // Return the created condition resources
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while processing compositions.");
  }
}

module.exports = { MedicationResource }; // Export the function
