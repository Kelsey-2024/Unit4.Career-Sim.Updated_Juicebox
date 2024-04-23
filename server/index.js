const app = require("./app");
require("dotenv").config();

//can be found in .env file
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});