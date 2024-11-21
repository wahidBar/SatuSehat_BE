const { Pool } = require("pg");

const pool = new Pool({
  user: "hero",
  host: "database-tm1.cdzzuf9nkusm.ap-southeast-1.rds.amazonaws.com",
  database: "kesehatan",
  password: "pens2024",
  port: 5432,
});

async function fetchCounter() {
  try {
    const encounter = await pool.query(
      `SELECT 
        t_pendaftaran.pendaftaran_id,
        t_pendaftaran.pendaftaran_no,
        t_pendaftaran.pendaftaran_uuid,
        t_pendaftaran.pendaftaran_mrs,
        t_pendaftaran.pendaftaran_krs,
        CASE
            WHEN COALESCE(t_pendaftaran.pendaftaran_lrs, '1970-01-01 00:00:00') < t_pendaftaran.pendaftaran_mrs 
            THEN t_pendaftaran.pendaftaran_mrs
            WHEN COALESCE(t_pendaftaran.pendaftaran_lrs, '1970-01-01 00:00:00') > t_pendaftaran.pendaftaran_krs 
            THEN t_pendaftaran.pendaftaran_krs
            ELSE COALESCE(t_pendaftaran.pendaftaran_lrs, '1970-01-01 00:00:00')
        END AS pendaftaran_lrs,
        m_pasien.pasien_fhir_id,
        m_pasien.pasien_nama,
        m_pegawai.pegawai_fhir_id,
        m_pegawai.pegawai_nama,
        m_unit.unit_fhir_id,
        m_unit.unit_nama
        FROM 
            t_pendaftaran
        JOIN 
            m_pasien ON m_pasien.pasien_id = t_pendaftaran.m_pasien_id
        JOIN 
            m_pegawai ON m_pegawai.pegawai_id = t_pendaftaran.pendaftaran_dokter
        JOIN 
            m_unit ON m_unit.unit_id = t_pendaftaran.m_unit_id
        WHERE 
            t_pendaftaran.pendaftaran_aktif = 'y'
            AND t_pendaftaran.pendaftaran_krs IS NOT NULL 
            AND COALESCE(t_pendaftaran.pendaftaran_uuid, '') <> ''
            AND COALESCE(m_pasien.pasien_fhir_id, '') <> ''
            AND COALESCE(m_pegawai.pegawai_fhir_id, '') <> ''
            AND COALESCE(m_unit.unit_fhir_id, '') <> ''
        ORDER BY 
            t_pendaftaran.pendaftaran_id DESC;

        ORDER BY 
            t_pendaftaran.pendaftaran_id DESC;
      `
    );
    return {
      uuid: uuid.rows[0].pendaftaran_uuid,
      patientId: uuid.rows[0].m_pasien_id,
      patientName: uuid.rows[0].pendaftaran_pasien_nama,
    };
  } catch (err) {
    console.error("Error executing query:", err.message);
    throw err;
  }
}

module.exports = (async () => {
  const { uuid, patientId, patientName } = await fetchCounter();
  console.log(uuid, patientId, patientName);
  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        fullUrl: "urn:uuid:" + String(uuid),
        resource: {
          resourceType: "Encounter",
          identifier: [
            {
              system:
                "http://sys-ids.kemkes.go.id/encounter/1073fe73-02fd-4587-bf54-6d47c3663a2a",
              value: String(patientId),
            },
          ],
          status: "finished",
          class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory",
          },
          subject: {
            reference: "Patient/100000030009",
            display: String(patientName),
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
                reference: "Practitioner/N10000001",
                display: "Dokter Bronsig",
              },
            },
          ],
          period: {
            start: "2023-09-14T00:00:00+00:00",
            end: "2023-09-14T02:00:00+00:00",
          },
          location: [
            {
              location: {
                reference: "Location/ef011065-38c9-46f8-9c35-d1fe68966a3e",
                display: "Ruang 1A, Poliklinik Rawat Jalan",
              },
            },
          ],
          diagnosis: [
            {
              condition: {
                reference: "urn:uuid:c820f626-0dfd-4a9b-acda-5b8d526429f6",
                display:
                  "Tuberculosis of lung, confirmed by sputum microscopy with or without culture",
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
              rank: 1,
            },
          ],
          statusHistory: [
            {
              status: "arrived",
              period: {
                start: "2023-09-14T00:00:00+00:00",
                end: "2023-09-14T01:00:00+00:00",
              },
            },
            {
              status: "in-progress",
              period: {
                start: "2023-09-14T01:00:00+00:00",
                end: "2023-09-14T02:00:00+00:00",
              },
            },
            {
              status: "finished",
              period: {
                start: "2023-09-14T02:00:00+00:00",
                end: "2023-09-14T02:00:00+00:00",
              },
            },
          ],
          serviceProvider: {
            reference: "Organization/1073fe73-02fd-4587-bf54-6d47c3663a2a",
          },
        },
        request: {
          method: "POST",
          url: "Encounter",
        },
      },
      {
        fullUrl: "urn:uuid:39ada41c-dc1b-4a71-9c59-778b6c1503d3",
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
            reference: "Patient/100000030009",
          },
          performer: [
            {
              reference: "Practitioner/N10000001",
            },
          ],
          encounter: {
            reference: "urn:uuid:" + String(uuid),
            display: "Pemeriksaan Fisik Nadi Budi Santoso di 14 September 2023",
          },
          effectiveDateTime: "2023-09-14T01:00:00+00:00",
          issued: "2023-09-14T01:00:00+00:00",
          valueQuantity: {
            value: 80,
            unit: "beats/minute",
            system: "http://unitsofmeasure.org",
            code: "/min",
          },
        },
        request: {
          method: "POST",
          url: "Observation",
        },
      },
      {
        fullUrl: "urn:uuid:c820f626-0dfd-4a9b-acda-5b8d526429f6",
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
                  code: "encounter-diagnosis",
                  display: "Encounter Diagnosis",
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: "http://hl7.org/fhir/sid/icd-10",
                code: "A15.0",
                display:
                  "Tuberculosis of lung, confirmed by sputum microscopy with or without culture",
              },
            ],
          },
          subject: {
            reference: "Patient/100000030009",
            display: String(patientName),
          },
          encounter: {
            reference: "urn:uuid:" + String(uuid),
          },
          onsetDateTime: "2023-09-14T01:00:00+00:00",
          recordedDate: "2023-09-14T01:00:00+00:00",
        },
        request: {
          method: "POST",
          url: "Condition",
        },
      },
      {
        fullUrl: "urn:uuid:fb7d9e9d-2068-42f7-9af5-d9b18226b4c0",
        resource: {
          resourceType: "Procedure",
          status: "completed",
          category: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "103693007",
                display: "Diagnostic procedure",
              },
            ],
            text: "Diagnostic procedure",
          },
          code: {
            coding: [
              {
                system: "http://hl7.org/fhir/sid/icd-9-cm",
                code: "87.44",
                display: "Routine chest x-ray, so described",
              },
            ],
          },
          subject: {
            reference: "Patient/100000030009",
            display: String(patientName),
          },
          encounter: {
            reference: "urn:uuid:" + String(uuid),
            display: "Tindakan Rontgen Dada Budi Santoso di 14 September 2023",
          },
          performedPeriod: {
            start: "2023-09-14T01:00:00+00:00",
            end: "2023-09-14T01:00:00+00:00",
          },
          performer: [
            {
              actor: {
                reference: "Practitioner/N10000001",
                display: "Dokter Bronsig",
              },
            },
          ],
          reasonCode: [
            {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10",
                  code: "A15.0",
                  display:
                    "Tuberculosis of lung, confirmed by sputum microscopy with or without culture",
                },
              ],
            },
          ],
          bodySite: [
            {
              coding: [
                {
                  system: "http://snomed.info/sct",
                  code: "302551006",
                  display: "Entire Thorax",
                },
              ],
            },
          ],
          note: [
            {
              text: "Rontgen thorax melihat perluasan infiltrat dan kavitas.",
            },
          ],
        },
        request: {
          method: "POST",
          url: "Procedure",
        },
      },
      {
        fullUrl: "urn:uuid:153f6e12-207c-4b54-bc7d-bf9cf0fe3e5c",
        resource: {
          resourceType: "Composition",
          identifier: {
            system: "http://sys-ids.kemkes.go.id/composition/10000004",
            value: String(patientId),
          },
          status: "final",
          type: {
            coding: [
              {
                system: "http://loinc.org",
                code: "18842-5",
                display: "Discharge summary",
              },
            ],
          },
          category: [
            {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "LP173421-1",
                  display: "Report",
                },
              ],
            },
          ],
          subject: {
            reference: "Patient/100000030009",
            display: String(patientName),
          },
          encounter: {
            reference: "urn:uuid:" + String(uuid),
            display: "Kunjungan Budi Santoso di 14 September 2023",
          },
          date: "2023-09-14T01:00:00+00:00",
          author: [
            {
              reference: "Practitioner/N10000001",
              display: "Dokter Bronsig",
            },
          ],
          title: "Resume Medis Rawat Jalan",
          custodian: {
            reference: "Organization/10000004",
          },
          section: [
            {
              code: {
                coding: [
                  {
                    system: "http://loinc.org",
                    code: "42344-2",
                    display: "Discharge diet (narrative)",
                  },
                ],
              },
              text: {
                status: "additional",
                div: "Rekomendasi diet rendah lemak, rendah kalori",
              },
            },
          ],
        },
        request: {
          method: "POST",
          url: "Composition",
        },
      },
    ],
  };
})();
