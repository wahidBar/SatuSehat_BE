async function CompositionResource(
  compositions,
  pasienID,
  pasienNama,
  pegawaiID,
  pegawaiNama,
  fullUrl,
  start,
  end
) {
  try {
    if (!compositions || compositions.length === 0) {
      return null;
    }

    // formated date
    const formatDateToISO = (dateString) => {
      const date = new Date(dateString); // Membuat objek Date dari string
      return date.toISOString(); // Mengonversi ke format ISO 8601
    };

    const createResource = (compositionItem) => {
      console.log(compositionItem);
      return {
        fullUrl: "urn:uuid:" + String(compositionItem.diagnosa9_uuid),
        resource: {
          resourceType: "Procedure",
          status: "not-done",
          category: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "103693007",
                display: "Diagnostic procedure",
              },
            ],
            text: "Prosedur diagnostik",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: String(compositionItem.icd9_kode),
                display: String(compositionItem.icd9_nama),
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
          performedPeriod: {
            start: formatDateToISO(start),
            end: formatDateToISO(end),
          },
          performer: [
            {
              actor: {
                reference: "Practitioner/" + String(pegawaiID),
                display: String(pegawaiNama),
              },
            },
          ],
          note: [
            {
              text: String(compositionItem.diagnosa9_keterangan),
            },
          ],
        },
        request: {
          method: "POST",
          url: "Procedure",
        },
      };
    };

    // Create condition resources
    const resources = compositions.map(createResource);

    return resources; // Return the created condition resources
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while processing compositions.");
  }
}

module.exports = { CompositionResource }; // Export the function
