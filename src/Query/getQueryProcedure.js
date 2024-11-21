async function getQueryProcedure(d1) {
  let sql = `
    SELECT
        diagnosa9_id,
        diagnosa9_uuid,
        icd9_kode,
        icd9_nama,
        diagnosa9_keterangan 
    FROM
        t_diagnosa9
        JOIN m_icd9 ON m_icd9.icd9_id = t_diagnosa9.diagnosa9_icd9_id 
    WHERE
        t_diagnosa9.diagnosa9_pendaftaran_id = '${d1}' 
        AND t_diagnosa9.diagnosa9_aktif = 'y' 
    ORDER BY
        t_diagnosa9.diagnosa9_id ASC
    `;

  return sql;
}

module.exports = { getQueryProcedure };
