import csurf from "csurf";
// import { CSRF_SECRET } from "../config.js";

const csrfProtection = csurf({
  cookie: {
    key: 'csrfToken',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  }
});

export default csrfProtection;
