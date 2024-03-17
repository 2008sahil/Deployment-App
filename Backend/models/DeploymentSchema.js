const mongoose = require("mongoose");

const DeploymentSchema = mongoose.Schema(
  {
    projectId:{ type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    status:{type:String},
    logs:[{type:String}]    
  },
  { timestamps: true }
);

const Deployment = mongoose.model("Deployment", DeploymentSchema);

module.exports = Deployment;

