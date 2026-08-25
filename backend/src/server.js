require("dotenv").config();

const { PORT } = require("./secret");
const app = require("./app");
const mongoDatabase = require("./Config/db");
console.log("PORT =", PORT);
console.log("APP =", typeof app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    mongoDatabase();
});