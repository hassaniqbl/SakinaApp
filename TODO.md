# TODO - SC SIX WEEK & ANNUAL POSTNATAL CHECKUP APIs

## Phase 1: Validation Middleware
- [ ] Add `server/modules/six-week-checkups/six-week-checkups.validation.js` with express-validator rules based on the provided schema.
- [x] Add `server/modules/annual-checkups/annual-checkups.validation.js` with express-validator rules based on the provided schema.


## Phase 2: Routes wiring
- [ ] Update `server/routes/six-week-checkups.routes.js` to use validation middleware + `validateRequest`.
- [ ] Update `server/routes/annual-checkups.routes.js` to use validation middleware + `validateRequest`.

## Phase 3: Controller refactor
- [ ] Update `server/modules/six-week-checkups/six-week-checkups.controller.js` to remove inline validation helpers and rely on validated body.
- [ ] Update `server/modules/annual-checkups/annual-checkups.controller.js` to map full request body to model payload.

## Phase 4: Model fixes for Annual (full schema CRUD)
- [ ] Update `server/modules/annual-checkups/annual-checkups.model.js` to fully implement:
  - [x] insert with full column list

  - [x] getAll selects full record columns + pagination

  - [x] update with full column list + DATE_UPDATED=NOW()

- [x] soft delete sets IS_DELETED=1 + DATE_UPDATED=NOW()




## Phase 5: Final verification
- [ ] Ensure centralized error handling works for validation/model errors.
- [ ] Smoke test CRUD endpoints:
  - [ ] POST + GET by id
  - [ ] GET all with pagination params
  - [ ] PUT update
  - [ ] DELETE soft delete then GET does not return the record

