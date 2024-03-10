const mongoose = require("mongoose");

const Userschema = mongoose.Schema(
  {
    username:{type:String},
    name:{type:String},
    email:{type:String},
    accessToken:{type:String},
    Projects:[{type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", Userschema);

module.exports = User;
