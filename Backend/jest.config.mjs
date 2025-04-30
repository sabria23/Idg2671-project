export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest"
  }
};

/*
testEnvironment: Specifies that Jest should use the Node environment (since we’re testing a backend API).
transform: Ensures that Jest uses Babel to transform ES6 syntax into compatible JavaScript.*/
// source: https://medium.com/@Chanuka72/how-to-set-up-jest-testing-for-node-js-api-endpoints-with-es6-modules-056b5346b59d