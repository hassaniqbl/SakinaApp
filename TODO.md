# TODO - SakinaApp Backend (SAKINA_CARE)

## Plan implementation checklist
- [ ] 1) Create complete production folder structure under `server/`
- [ ] 2) Add/adjust `server/package.json` dependencies for: jwt, bcrypt, multer, cors, swagger, validation utilities, logger
- [ ] 3) Add `.env.example` and environment loader
- [ ] 4) Implement MySQL connection setup + pooling
- [ ] 5) Add middleware: logger, JWT auth, validation, global error handler
- [ ] 6) Implement shared helpers: API response formatter + query parsing for pagination/search/sort/filter
- [ ] 7) Create modules for each SC table:
  - [x] a) SC_USER (auth + CRUD + profile picture upload)
  - [x] b) SC_PATIENT
  - [x] c) SC_DELIVERY
  - [ ] d) SC_ANEMIA_CHECKUP
  - [ ] e) SC_ANEMIA_PERFORMA
  - [ ] f) SC_SIX_WEEK_POSTNATAL_CHECKUP
  - [ ] g) SC_ANNUAL_POSTNATAL_CHECKUP
- [ ] 8) Implement controllers + models + routes for all CRUD endpoints (Create/GetAll/GetById/Update/SoftDelete)
- [ ] 9) Ensure Get All supports pagination, sorting, filtering, search
- [ ] 10) Add Swagger documentation for all endpoints + JWT scheme
- [ ] 11) Add Postman collection JSON + API testing guide
- [ ] 12) Add Seed admin user script (hash password, insert into SC_USER)
- [ ] 13) Add file upload API for profile pictures (multer) and update PROFILE_PICTURE_URL
- [ ] 14) Replace current server `index.js` with Express app setup using the new structure
- [ ] 15) Add README with MySQL setup guide + step-by-step run instructions + sample payloads
- [ ] 16) Add API response examples (success/error) aligned to required schema
- [ ] 17) Smoke test: start server + check `/api-docs` and one CRUD flow per module

