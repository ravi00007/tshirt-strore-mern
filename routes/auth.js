const express = require("express");
const router = express.Router();
const { singOut, singUp, singIn, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

router.post(
  "/singup",
  [
    check("name", "name should be atleast 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password is required").isLength({ min: 3 }),
  ],
  singUp
);

router.post(
  "/singin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password should be atleast 3 char").isLength({ min: 3 }),
  ],
  singIn
);

router.get("/singout", singOut);
router.get("/test",isSignedIn,(req,res)=>{
    res.send("A proceted route!")
});

module.exports = router;
