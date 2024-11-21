async function ConditionResource(
  conditions,
  pasienID,
  PasienNama,
  pegawaiID,
  pegawaiNama,
  fullUrl
) {
  try {
    if (!conditions || conditions.length === 0) {
      return null;
    }

    const createResource = (conditionItem) => {
      console.log(conditionItem);
      return {
        fullUrl: "urn:uuid:" + conditionItem.diagnosapasien_uuid, // You may want to dynamically generate this
        resource: {
          resourceType: "Condition",
          clinicalStatus: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active",
                display: "Active",
              },
            ],
          },
          category: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/condition-category",
                  code: "problem-list-item",
                  display: "Problem List Item",
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: conditionItem.icd_kode,
                display: conditionItem.icd_nama,
              },
            ],
          },
          subject: {
            reference: `Patient/` + String(pasienID),
            display: String(PasienNama),
          },
          encounter: {
            reference: "urn:uuid:" + fullUrl, // You may want to dynamically generate this
          },
          onsetDateTime: new Date(
            conditionItem.diagnosapasien_tanggal
          ).toISOString(),
          recordedDate: new Date().toISOString(),

          recorder: {
            reference: `Practitioner/` + String(pegawaiID),
            display: String(pegawaiNama),
          },
          note: [
            {
              text: conditionItem.diagnosapasien_keterangan,
            },
          ],
        },
        request: {
          method: "POST",
          url: "Condition",
        },
      };
    };

    // Create condition resources
    const resources = conditions.map(createResource);

    return resources; // Return the created condition resources
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while processing conditions.");
  }
}

module.exports = { ConditionResource }; // Export the function
