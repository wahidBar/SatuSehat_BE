async function getQueryEncounter(tanggal1, tanggal2) {
  let sql = `
    SELECT 
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
        AND t_pendaftaran.pendaftaran_mrs between '${tanggal1}' and '${tanggal2}'
      ORDER BY 
        t_pendaftaran.pendaftaran_id DESC;
    `;
  return sql;
}

module.exports = {
  getQueryEncounter,
};
// export {getQueryEncounter};
