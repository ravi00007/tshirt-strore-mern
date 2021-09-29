const mongoose =  require("mongoose");
const crypto = require('crypto');
const uuid =  require('uuid/v1');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname:{
        type: String,
        maxlength: 32,
        trim: true
    },
    
    gender:{
      type: String,
    },
    userinfo:{
      type: String,
      trim: true
    },
    email:{
        type: String,
        required: true,
        trim:  true,
        unique: true
    },
    encry_password:{
        type: String,
        required: true
    },
    salt: String,
     role:{
         type: Number,
         default: 0
     },
     purchases:{
         type: Array,
         default: []
     }
},{timestamps: true})

userSchema.virtual("password ")  
          .set(function(password){
              this._password =  password;
              this.salt = uuid();
              this.encry_password = this.securePassword(password)
          })
          .get(function(){
              return this._password;
          })

userSchema.method = {
    authenticate: function(password){
        return this.securePassword(password) === this.encry_password;

    },
    securePassword: function(plainPassword){
        if(!plainPassword) return "";

        try{
           return crypto.createHmac('sha256', this.salt)
                  .update(plainPassword)
                  .digest('hex');
        }catch(err){
            return "";  

        }
    }
}

module.exports =   mongoose.model("User",userSchema)