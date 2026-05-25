function validateBody(schema, { skipMissing = false } = {}) {
  return (req, res, next) => {
    const errors = [];

    for (const [key, rule] of Object.entries(schema)) {
      const val = req.body?.[key];
      if (val === undefined || val === null || val === "") {
        if (rule.required && !skipMissing) {
          errors.push(`${key} is required`);
        }
        continue;
      }

      if (rule.type === "integer") {
        const n = Number(val);
        if (!Number.isFinite(n)) errors.push(`${key} must be an integer`);
      }

      if (rule.type === "string") {
        if (typeof val !== "string") errors.push(`${key} must be a string`);
      }

      if (rule.format === "email") {
        const emailStr = String(val).trim();
        // Simple email regex suitable for API validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailStr)) errors.push(`${key} must be a valid email address`);
      }

      if (rule.type === "number") {
        const n = Number(val);
        if (!Number.isFinite(n)) errors.push(`${key} must be a number`);
      }


      if (rule.enum && !rule.enum.includes(val)) {
        errors.push(`${key} must be one of: ${rule.enum.join(", ")}`);
      }

      if (typeof rule.min === "number" && typeof val !== "number") {
        // allow numeric strings
        const n = Number(val);
        if (Number.isFinite(n) && n < rule.min) {
          errors.push(`${key} must be >= ${rule.min}`);
        }
      } else if (typeof rule.min === "number" && typeof val === "number") {
        if (val < rule.min) errors.push(`${key} must be >= ${rule.min}`);
      }


      if (typeof rule.max === "number" && typeof val !== "number") {
        const n = Number(val);
        if (Number.isFinite(n) && n > rule.max) errors.push(`${key} must be <= ${rule.max}`);
      } else if (typeof rule.max === "number" && typeof val === "number") {
        if (val > rule.max) errors.push(`${key} must be <= ${rule.max}`);
      }
    }

    if (errors.length) {
      return res.status(400).json({ message: "Validation error", errors });
    }

    return next();
  };
}

module.exports = { validateBody };

