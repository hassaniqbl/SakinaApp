# TODO

## Authentication: add remaining endpoints

- [ ] Gather existing project patterns for auth endpoints, validation, routing, and swagger.
- [ ] Implement `POST /auth/logout` (controller, service, validation, routes, swagger).
- [ ] Implement `POST /auth/forgot-password` (controller, service, validation, routes, swagger).
- [ ] Ensure consistent API response format and error handling (HttpError + error middleware).
- [ ] Update Swagger/OpenAPI docs with request/response schemas, validation rules, authentication requirements, and examples.
- [ ] Add/adjust any DB model methods needed for logout/forgot-password.
- [ ] Run server lint/tests (if available) and do a quick smoke check of swagger generation.

