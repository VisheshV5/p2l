const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@cluster.yklpifp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });


app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/feed.routes")(app);
require("./app/routes/groups.routes")(app);
require("./app/routes/jobs.routes")(app);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
