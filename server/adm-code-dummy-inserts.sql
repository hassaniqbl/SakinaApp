-- Dummy inserts for ADM_CODE and ADM_CODE_ITEM (for testing)

INSERT INTO ADM_CODE (CODE_NAME, CODE_DESCRIPTION, IS_DELETED, ADDED_BY, UPDATED_BY, DATE_CREATED, DATE_UPDATED)
VALUES ('Gender', 'Gender Master', b'0', 1, 1, NOW(), NOW());

-- NOTE: If CODE_ID is auto-increment, fetch it before inserting items.
-- Example (manual):
-- SELECT CODE_ID FROM ADM_CODE WHERE CODE_NAME='Gender' AND IS_DELETED=b'0';

-- Assuming Gender CODE_ID = 1 for testing
INSERT INTO ADM_CODE_ITEM (CODE_ID, ITEM_NAME, ITEM_VALUE, DISPLAY_ORDER, IS_DELETED, ADDED_BY, UPDATED_BY, DATE_CREATED, DATE_UPDATED)
VALUES
  (1, 'Male', 'M', 1, b'0', 1, 1, NOW(), NOW()),
  (1, 'Female', 'F', 2, b'0', 1, 1, NOW(), NOW());

