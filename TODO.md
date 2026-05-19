# TODO

## Implement fix for `GET /users` returning 500

- [ ] Fix SQL query construction in `server/modules/users/users.model.js#getAllUsers` to avoid runtime MySQL errors and align params.
- [ ] Improve error middleware to include `err.message` details for easier debugging.
- [ ] Restart server using `server/server.js` (or confirm currently running entrypoint) and verify `curl http://localhost:5000/users` works.

