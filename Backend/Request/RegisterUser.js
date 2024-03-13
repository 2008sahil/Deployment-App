const express=require("express")
const router = express.Router();
const User =require("../models/Userschema")
const Project=require("../models/ProjectSchema")

const Client_ID="1358438808b90040cd6f";
const Client_Secret="0645acc3480c79f5e2c577e17044a93a4c137c08";

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
        // console.log("user is ",userData)
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
        const originalRepos = data.filter(repo => !repo.fork);
        res.send(originalRepos.map(repo => ({ name: repo.name, url: repo.clone_url })))
    })
})

router.post('/createproject',async(req,res)=>{
    const project=await Project.create({
        userId:req.body.userId,
        name:req.body.projectname,
        description:req.body.description,
        repositoryUrl:req.body.repositoryUrl,
        ProjectId:req.body.ProjectId
    })
    // console.log(project)
    res.send(project);
})



module.exports = router;