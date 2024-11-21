async function getQueryCondition(d1) {
  let sql = `
    
    SELECT
        diagnosapasien_id,
        diagnosapasien_uuid,
        icd_kode,
        icd_nama,
        diagnosapasien_tanggal,
        diagnosapasien_keterangan 
    FROM
        t_diagnosa_pasien
        JOIN m_icd ON m_icd.icd_id = t_diagnosa_pasien.m_icd_id 
    WHERE
        t_diagnosa_pasien.t_pendaftaran_id = '${d1}'  
        AND t_diagnosa_pasien.diagnosapasien_aktif = 'y' 
    ORDER BY
        t_diagnosa_pasien.diagnosapasien_jenis DESC,
        t_diagnosa_pasien.diagnosapasien_id ASC
    
    `;

  return sql;
}
module.exports = { getQueryCondition };
