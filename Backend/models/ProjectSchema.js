const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema(
  {
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name:{type:String,required:true},
    description:{type:String,unique:true},
    repositoryUrl:{type:String,required:true},
    ProjectId:{type:String,require:true}
    
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
