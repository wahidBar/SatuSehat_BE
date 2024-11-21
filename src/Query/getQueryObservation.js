function getQueryObservation(d1) {
  let sql = `
   SELECT 
    row_number() OVER (PARTITION BY t_riwayat_periksa.periksa_pendaftaran_id ORDER BY t_riwayat_periksa.periksa_id) AS periksa_rank,
    t_riwayat_periksa.periksa_id,
    t_riwayat_periksa.periksa_pendaftaran_id,
    t_riwayat_periksa.periksa_tensi,
    t_riwayat_periksa.periksa_suhu,
    t_riwayat_periksa.periksa_jantung,
    t_riwayat_periksa.periksa_nafas
FROM 
    t_riwayat_periksa
WHERE 
    t_riwayat_periksa.periksa_pendaftaran_id = '${d1}'

UNION ALL

SELECT 
    row_number() OVER (PARTITION BY t_riwayat_periksa_hemodialisa.periksahemodialisa_pendaftaran_id ORDER BY t_riwayat_periksa_hemodialisa.periksahemodialisa_id) AS periksa_rank,
    t_riwayat_periksa_hemodialisa.periksahemodialisa_id AS periksa_id,
    t_riwayat_periksa_hemodialisa.periksahemodialisa_pendaftaran_id AS periksa_pendaftaran_id,
    t_riwayat_periksa_hemodialisa.periksahemodialisa_tensi AS periksa_tensi,
    t_riwayat_periksa_hemodialisa.periksahemodialisa_suhu AS periksa_suhu,
    t_riwayat_periksa_hemodialisa.periksahemodialisa_jantung AS periksa_jantung,
    t_riwayat_periksa_hemodialisa.periksahemodialisa_nafas AS periksa_nafas
FROM 
    t_riwayat_periksa_hemodialisa
WHERE 
    t_riwayat_periksa_hemodialisa.periksahemodialisa_pendaftaran_id = '${d1}'
     `;
  return sql;
}

module.exports = { getQueryObservation };
