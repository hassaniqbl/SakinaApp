// Safe query helpers for list endpoints (pagination/search/sort/filter)

function getPagination(query) {
  const page = Math.max(parseInt(query.page || "1", 10), 1);
  const limitRaw = parseInt(query.limit || "10", 10);
  const limit = Math.min(Math.max(limitRaw, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function normalizeSort(query, allowedColumns, defaultColumn) {
  const sortBy = query.sortBy && allowedColumns.includes(query.sortBy) ? query.sortBy : defaultColumn;
  const sortOrder = (query.sortOrder || "DESC").toUpperCase();
  const order = sortOrder === "ASC" ? "ASC" : "DESC";
  return { sortBy, sortOrder: order };
}

function buildSearchClause({ searchFields, searchQuery, operator = "LIKE" }) {
  if (!searchQuery) return { clause: "", params: [] };
  const like = `%${searchQuery}%`;
  const parts = searchFields.map((f) => `${f} ${operator} ?`);
  return { clause: parts.join(" OR "), params: searchFields.map(() => like) };
}

function buildFilterClause({ filters, allowedFilters }) {
  // filters: object from req.query
  // allowedFilters: { key: { column, type } }
  const clauses = [];
  const params = [];

  for (const [key, spec] of Object.entries(allowedFilters || {})) {
    const val = filters[key];
    if (val === undefined || val === null || val === "") continue;

    if (spec.type === "number") {
      const n = Number(val);
      if (!Number.isFinite(n)) continue;
      clauses.push(`${spec.column} = ?`);
      params.push(n);
    } else {
      clauses.push(`${spec.column} = ?`);
      params.push(val);
    }
  }

  if (!clauses.length) return { clause: "", params: [] };
  return { clause: clauses.join(" AND "), params };
}

module.exports = { getPagination, normalizeSort, buildSearchClause, buildFilterClause };

