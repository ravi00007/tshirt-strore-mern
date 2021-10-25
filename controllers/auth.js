const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
exports.singOut = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "User singOut sucessfully",
  });
};
exports.singIn = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg,
    });
  }
  User.findOne({ email }, (err, doc) => {
    if (err || !doc) {
      return res.status(400).json({
        msg: "email has not register yet!",
      });
    }
    if (!doc.autheticate(password)) {
      return res.status(401).json({
        error: "Email and Password does't match",
      });
    }
    // creating token
    const token = jwt.sign({ id: doc._id }, process.env.SECRET);
    // seting token  to cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    // sending response
    const { _id, email, role } = doc;
    return res.json({
      token,
      user: {
        _id,
        email,
        role,
      },
    });
  });
};
exports.singUp = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg,
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        message: "not able to save to DB",
        err: err,
      });
    }
    return res.status(200).json({
      data: user,
    });
  });
};

// procetected route

exports.isSignedIn =  expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})

exports.isAuthenticated = (req,res,next)=>{
  
    const checker =  req.profile && req.auth && req.profile._id == req.auth.id
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next()

}

exports.isAdmin = (req,res,next)=>{
  console.log("this is profile =>" + req.profile)
  console.log("this is role " + req.profile.role)
    if(req.profile.role == 0){
        return res.status(403).json({
            error: "You Are Not Admin"
        })
    }
    next();
}