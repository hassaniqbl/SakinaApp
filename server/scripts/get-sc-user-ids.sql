-- If your project actually uses SC_USER table name, use this instead.
-- It mirrors the ADM_USER lookup but for SC_USER.

SELECT USER_ID, EMAIL, FIRSTNAME, LASTNAME, IS_DELETED
FROM SC_USER

WHERE IS_DELETED = b'0' OR IS_DELETED = 0;

