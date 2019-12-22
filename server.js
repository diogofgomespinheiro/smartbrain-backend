const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cors = require("cors");
const knex = require("knex");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const register = require("./controllers/register");
const signin = require("./controllers/signIn");
const profile = require("./controllers/profile");

console.log(process.env.POSTGRES_PASSWORD)

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("It is working");
});

app.post("/signIn",signin.handleSignIn(db, bcrypt));

app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds)});

app.get("/profile/:id", profile.getProfile(db));

app.put("/profile/entries", profile.getEntries(db));

app.post("/profile/api", profile.handleApiCall());

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000 }`);
});
