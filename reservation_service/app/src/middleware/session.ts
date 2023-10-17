import * as session from "express-session";
import config from "src/config";

export default session({
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: false,
})
