# TODO

## Anemia Checkups - PUT /anemia-checkups/{id} Swagger Request Body

- [ ] Inspect current Swagger annotations for PUT endpoint.
- [ ] Update requestBody schema in `server/routes/anemia-checkups.routes.js` to include all updatable fields with correct types/examples and exclude system-generated fields.
- [ ] Ensure request handler/validation accepts the same fields (controller already maps fields; confirm).
- [ ] Add/adjust validation schema if anemia-checkups validation module exists (or add one if missing).
- [ ] Run server lint/test (or start) and verify Swagger UI shows the request body for PUT.

