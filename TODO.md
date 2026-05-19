# TODO - ADM_CODE & ADM_CODE_ITEM CRUD + Lookup APIs

## Step 1: Create module folders/files
- [ ] Create `server/modules/adm-code/`
  - [ ] adm-code.model.js
  - [ ] adm-code.service.js
  - [ ] adm-code.controller.js
  - [ ] adm-code.validation.js
  - [ ] adm-code.routes.js
- [ ] Create `server/modules/adm-code-item/`
  - [ ] adm-code-item.model.js
  - [ ] adm-code-item.service.js
  - [ ] adm-code-item.controller.js
  - [ ] adm-code-item.validation.js
  - [ ] adm-code-item.routes.js

## Step 2: Wire routes into main router
- [ ] Update `server/routes/index.js` to mount both new route modules.

## Step 3: Implement SQL + business logic
- [ ] ADM_CODE CRUD in model/service/controller
- [ ] ADM_CODE_ITEM CRUD in model/service/controller
- [ ] Lookup endpoints in adm-code routes/model as specified
- [ ] Soft delete with `IS_DELETED` everywhere
- [ ] Transaction-based cascade soft delete on `DELETE /adm-code/:id`

## Step 4: Swagger documentation
- [ ] Add swagger-jsdoc blocks for every new endpoint in new `*.routes.js` files.

## Step 5: Dummy insert SQL for testing
- [ ] Add `server/adm-code-dummy-inserts.sql` with sample ADM_CODE + ADM_CODE_ITEM rows.

## Step 6: Sanity checks
- [x] Run a quick node syntax check / start server
- [ ] Verify swagger generation includes the new endpoints


