const Email = require("../../app/models/email.model");
const assert = require("assert");
const dotenv = require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const mongoose = require("mongoose");

// No need to set timeout globally here

mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
  }
);

mongoose.connection
  .once("open", () => console.log("Connected!"))
  .on("error", (error) => {
    console.warn("Error : ", error);
  });

afterEach((done) => {
  mongoose.connection.collections.emails.deleteOne(
    { email: "unit_test@thetiptop.com" },
    () => {
      done();
    }
  );
});

// Set timeout for all tests within this describe block
describe("Email tests", function() {
  this.timeout(20000); // Set timeout to 5 seconds for all tests in this describe block

  describe("Creating email", () => {
    it("Creates a New Email", (done) => {
      const newEmail = new Email({ email: "unit_test@thetiptop.com" });
      newEmail.save().then(() => {
        assert(!newEmail.isNew);
        done();
      });
    });
  });

  describe("Reading email", () => {
    it("Finds the email", (done) => {
      const newEmail = new Email({ email: "unit_test@thetiptop.com" });
      newEmail.save().then(() => {
        done();
      });
      Email.findOne({ email: "unit_test@thetiptop.com" }).then((user) => {
        assert(Email.email === "unit_test@thetiptop.com");
        done();
      });
    });
  });

  describe("Deleting email", () => {
    it("deletes the email", (done) => {
      const newEmail = new Email({ email: "unit_test@thetiptop.com" });
      newEmail.save().then(() => {
        done();
      });
      Email.findOneAndDelete({ email: "unit_test@thetiptop.com" })
        .then(() => User.findOne({ email: "unit_test@thetiptop.com" }))
        .then((user) => {
          assert(user === null);
          done();
      });
    });
  });
});
