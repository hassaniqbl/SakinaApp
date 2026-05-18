# TODO - Auth disabled for API testing

- [x] Implement DISABLE_AUTH flag support in `server/middleware/auth.middleware.js`
- [ ] Ensure running server uses the same `DISABLE_AUTH` env var (stop old processes, restart clean)
- [ ] If env var still not applied, provide a hard-coded “public mode” toggle (no env dependency) and re-test

