const { HttpError } = require("../../utils/httpError");
const { assertUserExists } = require("./patients.integrity");
const { updatePatient } = require("./patients.model");

/**
 * Service-layer validation for updating a patient.
 * - Ensures UPDATED_BY references an existing, non-deleted user.
 */
const updatePatientService = async (db, patientId, payload) => {
  const updatedByNum = payload?.UPDATED_BY;

  // UPDATED_BY is required at controller level, but keep service defensive.
  if (updatedByNum === undefined || updatedByNum === null || updatedByNum === "") {
    throw new HttpError(400, "UPDATED_BY is required");
  }

  // Validate FK parent row exists (SC_PATIENT(UPDATED_BY) -> ADM_USER(USER_ID))
  // Using existing integrity helper.
  // Validate FK only when user actually exists.
  // (Allows public mode without auth, while still validating when UPDATED_BY is provided.)
  await assertUserExists(db, updatedByNum, "UPDATED_BY");


  return updatePatient(db, patientId, payload);
};

module.exports = {
  updatePatientService,
};

