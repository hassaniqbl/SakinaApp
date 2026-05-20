const getAllAdmCodesSql = `
  SELECT
    CODE_ID,
    CODE_NAME,
    CODE_DESCRIPTION,
    IS_DELETED,
    ADDED_BY,
    UPDATED_BY,
    DATE_CREATED,
    DATE_UPDATED
  FROM ADM_CODE
  WHERE IS_DELETED = b'0'
  ORDER BY CODE_ID DESC
`;

const getAdmCodeByIdSql = `
  SELECT
    CODE_ID,
    CODE_NAME,
    CODE_DESCRIPTION,
    IS_DELETED,
    ADDED_BY,
    UPDATED_BY,
    DATE_CREATED,
    DATE_UPDATED
  FROM ADM_CODE
  WHERE CODE_ID = ? AND IS_DELETED = b'0'
`;

const createAdmCodeSql = `
  INSERT INTO ADM_CODE (
    CODE_NAME,
    CODE_DESCRIPTION,
    IS_DELETED,
    ADDED_BY,
    UPDATED_BY,
    DATE_CREATED,
    DATE_UPDATED
  ) VALUES (?, ?, b'0', ?, ?, NOW(), NOW())
`;

const updateAdmCodeSql = `
  UPDATE ADM_CODE
  SET
    CODE_NAME = ?,
    CODE_DESCRIPTION = ?,
    UPDATED_BY = ?,
    DATE_UPDATED = NOW()
  WHERE CODE_ID = ? AND IS_DELETED = b'0'
`;

const softDeleteAdmCodeSql = `
  UPDATE ADM_CODE
  SET
    IS_DELETED = b'1',
    UPDATED_BY = ?,
    DATE_UPDATED = NOW()
  WHERE CODE_ID = ? AND IS_DELETED = b'0'
`;

module.exports = {
  getAllAdmCodesSql,
  getAdmCodeByIdSql,
  createAdmCodeSql,
  updateAdmCodeSql,
  softDeleteAdmCodeSql,
};

