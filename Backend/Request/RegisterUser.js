const express=require("express")
const router = express.Router();
const User =require("../models/Userschema")
const Project=require("../models/ProjectSchema")
const deployment=require("../models/DeploymentSchema")

const Client_ID=process.env.clientId;
const Client_Secret=process.env.clientSecret;

router.get('/getAccessToken',async (req,res)=>{
    console.log(req.query.code)
    const Params="?client_id="+Client_ID+"&client_secret="+Client_Secret+"&code="+req.query.code
    await fetch("https://github.com/login/oauth/access_token"+Params,{
        method:"POST",
        headers:{
            "Accept":"application/json"
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        // console.log(data)
        res.send(data);
    }).catch((error)=>{
        res.send(error)
    })

})


router.get('/userdata', async (req,res)=>{
    // console.log(req.headers.authorization)

    await fetch("https://api.github.com/user",{
        method:"GET",
        headers:{
            "Authorization":req.headers.authorization
        }
    }).then((response)=>{
        return response.json();
    }).then(async (userData)=>{
        const user = await User.findOneAndUpdate(
            { username: userData.login },
            {
                username: userData.login,
                name: userData.name,
                email: userData.email || '',
                accessToken: req.headers.authorization
            },
            { upsert: true, new: true }
        );
        res.send(user);
    }).catch((error)=>{
        res.send(error)
    })

})
router.post('/getuserrepo', async (req,res)=>{
    console.log(req.headers.authorization)
    await fetch(`https://api.github.com/users/${req.body.username}/repos`,{
        method:"GET",
        headers:{
            "Authorization":req.headers.authorization
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        // console.log(data)
        const originalRepos = data.filter(repo => !repo.fork);
        res.send(originalRepos.map(repo => ({ name: repo.name, url: repo.clone_url })))
    })
})

router.post('/createproject',async(req,res)=>{
    const project=await Project.create({
        userId:req.body.userId,
        name:req.body.projectname,
        reponame:req.body.reponame,
        description:req.body.description,
        repositoryUrl:req.body.repositoryUrl,
        ProjectId:req.body.ProjectId
    })
    // console.log(project)
    res.send(project);
})

router.get('/getProject',async(req,res)=>{
    const Projectarray=await Project.find({userId:req.headers.authorization})
    res.send(Projectarray);
})
router.get('/getDeployments',async(req,res)=>{
    const Deploymentarray=await deployment.find({projectId:req.headers.authorization}).sort({ createdAt: -1 })
    res.send(Deploymentarray);
})
router.get('/getDeployment',async(req,res)=>{
    const Deployment=await deployment.find({_id:req.headers.authorization}).populate("projectId")
    res.send(Deployment);
})




module.exports = router;