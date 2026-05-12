import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000";

const emptyPatient = {
  PATIENT_REGISTRATION_NUMBER: "",
  REGISTRATION_DATE: "",
  PATIENT_NAME: "",
  CNIC_NUMBER: "",
  PHONE_NUMBER: "",
  RELIGION: "",
  PATIENT_PROFESSION: "",
  PATIENT_MONTHLY_SALARY: "",
  AGE: "",
  ADDRESS: "",
  LOCATION: "",
  ESTIMATED_DATE_OF_DELIVERY: "",
  BASELINE_HAEMOGLOBIN_COUNT: "",
  EDUCATION: "",
  RESIDENCE_CONDITION: "",
  RESIDENCE_OWNERSHIP: "",
  HUSBAND_NAME: "",
  GRAVIDA: "",
  PARA: "",
  MISCARRIAGE: "",
  ANTENATAL_VISITS: "",
  CREATED_BY_LATITUDE: "",
  CREATED_BY_LONGITUDE: "",
  CREATED_AT: "",
  UPDATED_AT: "",
  CREATED_BY: "",
  UPDATED_BY: "",
};

function App() {
  const [patient, setPatient] = useState(emptyPatient);
  const [message, setMessage] = useState({ type: "success", text: "" });
  const messageTimeoutRef = useRef(null);

  const requiredFields = useMemo(
    () => ["PATIENT_REGISTRATION_NUMBER"],
    []
  );

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ type: "success", text: "" });
    }, 3000);
  };

  const handleChange = (key) => (e) => {
    setPatient((p) => ({ ...p, [key]: e.target.value }));
  };

  const resetForm = () => setPatient(emptyPatient);

  const toNullable = (v) => {
    const s = String(v ?? "");
    return s.trim() === "" ? null : v;
  };

  const toIntNullable = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const toDecimalNullable = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key of requiredFields) {
      if (!String(patient[key] ?? "").trim()) {
        showMessage("error", `Please fill ${key.replaceAll("_", " ")}`);
        return;
      }
    }

    try {
      await axios.post(`${API_BASE}/patients`, {
        PATIENT_REGISTRATION_NUMBER: toNullable(
          patient.PATIENT_REGISTRATION_NUMBER
        ),
        REGISTRATION_DATE: toNullable(patient.REGISTRATION_DATE),
        PATIENT_NAME: toNullable(patient.PATIENT_NAME),
        CNIC_NUMBER: toNullable(patient.CNIC_NUMBER),
        PHONE_NUMBER: toNullable(patient.PHONE_NUMBER),
        RELIGION: toNullable(patient.RELIGION),
        PATIENT_PROFESSION: toNullable(patient.PATIENT_PROFESSION),
        PATIENT_MONTHLY_SALARY: toNullable(patient.PATIENT_MONTHLY_SALARY),
        AGE: toNullable(patient.AGE),
        ADDRESS: toNullable(patient.ADDRESS),
        LOCATION: toNullable(patient.LOCATION),
        ESTIMATED_DATE_OF_DELIVERY: toNullable(
          patient.ESTIMATED_DATE_OF_DELIVERY
        ),
        BASELINE_HAEMOGLOBIN_COUNT: toNullable(
          patient.BASELINE_HAEMOGLOBIN_COUNT
        ),
        EDUCATION: toNullable(patient.EDUCATION),
        RESIDENCE_CONDITION: toNullable(patient.RESIDENCE_CONDITION),
        RESIDENCE_OWNERSHIP: toNullable(patient.RESIDENCE_OWNERSHIP),
        HUSBAND_NAME: toNullable(patient.HUSBAND_NAME),
        GRAVIDA: toIntNullable(patient.GRAVIDA),
        PARA: toIntNullable(patient.PARA),
        MISCARRIAGE: toIntNullable(patient.MISCARRIAGE),
        ANTENATAL_VISITS: toIntNullable(patient.ANTENATAL_VISITS),
        CREATED_BY_LATITUDE: toDecimalNullable(patient.CREATED_BY_LATITUDE),
        CREATED_BY_LONGITUDE: toDecimalNullable(
          patient.CREATED_BY_LONGITUDE
        ),
        CREATED_AT: toNullable(patient.CREATED_AT),
        UPDATED_AT: toNullable(patient.UPDATED_AT),
        CREATED_BY: toNullable(patient.CREATED_BY),
        UPDATED_BY: toNullable(patient.UPDATED_BY),
      });

      showMessage("success", "Patient registered successfully");
      resetForm();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "Failed to register patient";
      showMessage("error", msg);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Patient Registration</h1>

        {message.text ? (
          <div
            className={`message ${
              message.type === "error" ? "message--error" : "message--success"
            }`}
            role="status"
          >
            {message.text}
          </div>
        ) : null}

        <form className="card" onSubmit={handleSubmit}>
          <h2 className="cardTitle">PATIENT_PROFILE</h2>

          <div className="formGrid">
            <label className="field">
              <span>Patient Registration Number *</span>
              <input
                type="text"
                value={patient.PATIENT_REGISTRATION_NUMBER}
                onChange={handleChange("PATIENT_REGISTRATION_NUMBER")}
                placeholder="e.g. REG-001"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Registration Date</span>
              <input
                type="datetime-local"
                value={patient.REGISTRATION_DATE}
                onChange={handleChange("REGISTRATION_DATE")}
              />
            </label>

            <label className="field">
              <span>Patient Name</span>
              <input
                type="text"
                value={patient.PATIENT_NAME}
                onChange={handleChange("PATIENT_NAME")}
                placeholder="Enter patient name"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>CNIC Number</span>
              <input
                type="text"
                value={patient.CNIC_NUMBER}
                onChange={handleChange("CNIC_NUMBER")}
                placeholder="Enter CNIC"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Phone Number</span>
              <input
                type="text"
                value={patient.PHONE_NUMBER}
                onChange={handleChange("PHONE_NUMBER")}
                placeholder="Enter phone"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Religion</span>
              <input
                type="text"
                value={patient.RELIGION}
                onChange={handleChange("RELIGION")}
                placeholder="e.g. Islam"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Profession</span>
              <input
                type="text"
                value={patient.PATIENT_PROFESSION}
                onChange={handleChange("PATIENT_PROFESSION")}
                placeholder="Enter profession"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Monthly Salary</span>
              <input
                type="text"
                value={patient.PATIENT_MONTHLY_SALARY}
                onChange={handleChange("PATIENT_MONTHLY_SALARY")}
                placeholder="Enter salary"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Age</span>
              <input
                type="text"
                value={patient.AGE}
                onChange={handleChange("AGE")}
                placeholder="e.g. 28"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Location</span>
              <input
                type="text"
                value={patient.LOCATION}
                onChange={handleChange("LOCATION")}
                placeholder="e.g. Lahore"
                autoComplete="off"
              />
            </label>

            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <span>Address</span>
              <input
                type="text"
                value={patient.ADDRESS}
                onChange={handleChange("ADDRESS")}
                placeholder="Enter address"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Estimated Date of Delivery</span>
              <input
                type="datetime-local"
                value={patient.ESTIMATED_DATE_OF_DELIVERY}
                onChange={handleChange("ESTIMATED_DATE_OF_DELIVERY")}
              />
            </label>

            <label className="field">
              <span>Baseline Haemoglobin Count</span>
              <input
                type="text"
                value={patient.BASELINE_HAEMOGLOBIN_COUNT}
                onChange={handleChange("BASELINE_HAEMOGLOBIN_COUNT")}
                placeholder="e.g. 10.5"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Education</span>
              <input
                type="text"
                value={patient.EDUCATION}
                onChange={handleChange("EDUCATION")}
                placeholder="e.g. Matric"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Residence Condition</span>
              <input
                type="text"
                value={patient.RESIDENCE_CONDITION}
                onChange={handleChange("RESIDENCE_CONDITION")}
                placeholder="e.g. Good"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Residence Ownership</span>
              <input
                type="text"
                value={patient.RESIDENCE_OWNERSHIP}
                onChange={handleChange("RESIDENCE_OWNERSHIP")}
                placeholder="e.g. Owned"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Husband Name</span>
              <input
                type="text"
                value={patient.HUSBAND_NAME}
                onChange={handleChange("HUSBAND_NAME")}
                placeholder="Enter husband name"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Gravida</span>
              <input
                type="number"
                value={patient.GRAVIDA}
                onChange={handleChange("GRAVIDA")}
              />
            </label>

            <label className="field">
              <span>Para</span>
              <input
                type="number"
                value={patient.PARA}
                onChange={handleChange("PARA")}
              />
            </label>

            <label className="field">
              <span>Miscarriage</span>
              <input
                type="number"
                value={patient.MISCARRIAGE}
                onChange={handleChange("MISCARRIAGE")}
              />
            </label>

            <label className="field">
              <span>Antenatal Visits</span>
              <input
                type="number"
                value={patient.ANTENATAL_VISITS}
                onChange={handleChange("ANTENATAL_VISITS")}
              />
            </label>

            <label className="field">
              <span>Created By Latitude</span>
              <input
                type="text"
                value={patient.CREATED_BY_LATITUDE}
                onChange={handleChange("CREATED_BY_LATITUDE")}
                placeholder="e.g. 31.5204"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Created By Longitude</span>
              <input
                type="text"
                value={patient.CREATED_BY_LONGITUDE}
                onChange={handleChange("CREATED_BY_LONGITUDE")}
                placeholder="e.g. 74.3587"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Created At</span>
              <input
                type="datetime-local"
                value={patient.CREATED_AT}
                onChange={handleChange("CREATED_AT")}
              />
            </label>

            <label className="field">
              <span>Updated At</span>
              <input
                type="datetime-local"
                value={patient.UPDATED_AT}
                onChange={handleChange("UPDATED_AT")}
              />
            </label>

            <label className="field">
              <span>Created By</span>
              <input
                type="text"
                value={patient.CREATED_BY}
                onChange={handleChange("CREATED_BY")}
                placeholder="username/id"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Updated By</span>
              <input
                type="text"
                value={patient.UPDATED_BY}
                onChange={handleChange("UPDATED_BY")}
                placeholder="username/id"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="actions">
            <button className="btn btnPrimary" type="submit">
              Register Patient
            </button>
            <button className="btn" type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;

