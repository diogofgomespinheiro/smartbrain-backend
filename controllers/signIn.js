const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json("Incorrect form submit");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      bcrypt.compare(password, data[0].hash).then(isValid => {
        if (isValid) {
          db.select("*")
            .from("users")
            .where("email", "=", email)
            .then(user => {
              res.json(user[0]);
            })
            .catch(err => res.status(400).json("Unable to get user"));
        } else {
          console.log("password")
          res.status(400).json("Wrong password");
        }
      });
    })
    .catch(err => res.status(400).json("This email doesn´t exist"));
};

module.exports = {handleSignIn : handleSignIn}