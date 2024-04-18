const { auth } = require("express-oauth2-jwt-bearer");

exports.checkJwt = auth({
  audience: "https://dev-tbj3jwipicb0mdx3.us.auth0.com/api/v2/",
  issuerBaseURL: `dev-tbj3jwipicb0mdx3.us.auth0.com`,
});
