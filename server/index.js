const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected");
  }
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Register patient
app.post("/patients", (req, res) => {
  const {
    PATIENT_REGISTRATION_NUMBER,
    REGISTRATION_DATE,
    PATIENT_NAME,
    CNIC_NUMBER,
    PHONE_NUMBER,
    RELIGION,
    PATIENT_PROFESSION,
    PATIENT_MONTHLY_SALARY,
    AGE,
    ADDRESS,
    LOCATION,
    ESTIMATED_DATE_OF_DELIVERY,
    BASELINE_HAEMOGLOBIN_COUNT,
    EDUCATION,
    RESIDENCE_CONDITION,
    RESIDENCE_OWNERSHIP,
    HUSBAND_NAME,
    GRAVIDA,
    PARA,
    MISCARRIAGE,
    ANTENATAL_VISITS,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
    CREATED_AT,
    UPDATED_AT,
    CREATED_BY,
    UPDATED_BY,
  } = req.body;

  if (!PATIENT_REGISTRATION_NUMBER) {
    return res.status(400).json({
      message: "PATIENT_REGISTRATION_NUMBER is required",
    });
  }

  const sql = `INSERT INTO PATIENT_PROFILE (
    PATIENT_REGISTRATION_NUMBER,
    REGISTRATION_DATE,
    PATIENT_NAME,
    CNIC_NUMBER,
    PHONE_NUMBER,
    RELIGION,
    PATIENT_PROFESSION,
    PATIENT_MONTHLY_SALARY,
    AGE,
    ADDRESS,
    LOCATION,
    ESTIMATED_DATE_OF_DELIVERY,
    BASELINE_HAEMOGLOBIN_COUNT,
    EDUCATION,
    RESIDENCE_CONDITION,
    RESIDENCE_OWNERSHIP,
    HUSBAND_NAME,
    GRAVIDA,
    PARA,
    MISCARRIAGE,
    ANTENATAL_VISITS,
    CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE,
    CREATED_AT,
    UPDATED_AT,
    CREATED_BY,
    UPDATED_BY
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )`;


  const params = [
    PATIENT_REGISTRATION_NUMBER,
    REGISTRATION_DATE || null,
    PATIENT_NAME || null,
    CNIC_NUMBER || null,
    PHONE_NUMBER || null,
    RELIGION || null,
    PATIENT_PROFESSION || null,
    PATIENT_MONTHLY_SALARY || null,
    AGE || null,
    ADDRESS || null,
    LOCATION || null,
    ESTIMATED_DATE_OF_DELIVERY || null,
    BASELINE_HAEMOGLOBIN_COUNT || null,
    EDUCATION || null,
    RESIDENCE_CONDITION || null,
    RESIDENCE_OWNERSHIP || null,
    HUSBAND_NAME || null,
    GRAVIDA === undefined ? null : GRAVIDA,
    PARA === undefined ? null : PARA,
    MISCARRIAGE === undefined ? null : MISCARRIAGE,
    ANTENATAL_VISITS === undefined ? null : ANTENATAL_VISITS,
    CREATED_BY_LATITUDE === undefined ? null : CREATED_BY_LATITUDE,
    CREATED_BY_LONGITUDE === undefined ? null : CREATED_BY_LONGITUDE,
    CREATED_AT || null,
    UPDATED_AT || null,
    CREATED_BY || null,
    UPDATED_BY || null,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to create patient" });
    }
    res.status(201).json({
      message: "Patient Registered Successfully",
      affectedRows: result?.affectedRows,
    });
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id DESC", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
    res.json(result);
  });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch user" });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result[0]);
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to create user" });
      }
      res.status(201).json({
        message: "User Added Successfully",
        id: result.insertId,
      });
    }
  );
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update user" });
      }

      if (!result || result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User Updated Successfully" });
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete user" });
    }

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User Deleted Successfully" });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});