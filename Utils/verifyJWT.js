const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const options = {
  audience: "https://dev-tbj3jwipicb0mdx3.us.auth0.com/api/v2/",
  issuer: `https://dev-tbj3jwipicb0mdx3.us.auth0.com`,
  algorithms: ["RS256"],
};

const client = jwksClient({
  jwksUri: "https://dev-tbj3jwipicb0mdx3.us.auth0.com/.well-known/jwks.json",
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = {
  verifyToken,
};
