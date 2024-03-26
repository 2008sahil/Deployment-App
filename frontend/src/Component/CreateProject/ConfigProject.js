import React, { useState } from 'react'
import "./ConfigProject.css"
import { useLocation, useNavigate } from 'react-router-dom';
import githublogo from '../../Static/Images/github.svg'
import arrow from '../../Static/Images/arrow.png'
import branch from '../../Static/Images/branch.jpg'
import foldericon from '../../Static/Images/folder.jpg'
import { Octokit } from "@octokit/core";

export const ConfigProject = ({user}) => {
  const location = useLocation();
  const navigate=useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const accessToken=localStorage.getItem("auth");
  const repoName = searchParams.get('repoName');
  const repoUrl = searchParams.get('repoUrl');
  const [prname,setprname]=useState("")
  const [prdes,setprdes]=useState("")
  const [prId,setprId]=useState("")



  
  const octokit = new Octokit({
    auth: accessToken
  });
  
  async function setupWebhookForRepository(repoOwner, repoName, accessToken) {
    try {
      const response = await octokit.request(`POST /repos/${repoOwner}/${repoName}/hooks`, {
        owner: 'OWNER',
        repo: 'REPO',
        name: 'web',
        active: true,
        events: [
          'push',
          'pull_request'
        ],
        config: {
          url: 'https://webhook-lyart.vercel.app/github-webhook',
          content_type: 'json',
          insecure_ssl: '0'
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
  
      console.log(`Webhook set up successfully for repository: ${repoOwner}/${repoName}`);
      return response.data;
    } catch (error) {
      console.error(`Error setting up webhook for repository: ${repoOwner}/${repoName}`, error);
      throw new Error(`Failed to set up webhook for repository: ${repoOwner}/${repoName}`);
    }
  }


  const DeployPr =async()=>{
    const data={userId:user._id,projectname:prname,description:prdes,repositoryUrl:repoUrl,ProjectId:prId,reponame:repoName}
    await fetch('http://localhost:4000/user/createproject',{
      method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(data)
    }).then((data)=>{
      return data.json();
    }).then(async (data)=>{
      console.log("project saved",data)
      // const ProjectId={projectId:data._id};
      // await fetch('http://localhost:4000/project/create-deployemnt',{
      //   method:"POST",
      //   headers:{
      //     'Content-Type': 'application/json',
      //   },
      //   body:JSON.stringify(ProjectId)
      // }).then((res)=>{return res.json()}).then((status)=>{
      //   console.log("deployemnt created")
      
      // })
    })

    // console.log(accessToken)
  setupWebhookForRepository("2008sahil",repoName, accessToken)
  .then(webhookData => console.log('Webhook data:', webhookData))
  .catch(error => console.error('Error:', error));


    // navigate('/project')
  }
  return (
    <div className='ConfigProject'>
      <div className='Upper'>
        <div className='back'><img className='arrow' src ={arrow}/>Back</div>
        <div className='Title'>You're almost done.</div>
        <div className='SubTitle'>Please follow the steps to configure your Project and deploy it.</div>
        <div className='Projectname'><img className='logo' src ={githublogo}/>{repoName}</div>
      </div>
      <div className='Lower'>
        <div className='Left'>
          <div className='Box Box1'>
            <div style={{"fontWeight":"bold"}}>Configure Project</div>
            <div>Deploy</div>
          </div>
          <div className='Box Box2'>
            <div style={{'fontSize':'0.8rem','fontWeight':"600",'color':"#6e6767"}}>GIT REPOSITORY</div>

            <div  style={{"fontWeight":"bold",'display':'flex','alignItems':'center'}}><div><img className='logo' src={githublogo}/></div><div style={{"fontWeight":"bold"}}>{user ? `${user.username}/${repoName}`:""}</div></div>
            <div style={{'display':'flex',"alignItems":"center",'color':"#6e6767"}}><img  className="logo"src={branch}/>main</div>
            <div style={{'display':'flex',"alignItems":"center",'color':"#6e6767"}}><img  className="logo"src={foldericon}/>./</div>
          </div>
          <div className='Box3'>
            <span>Import A Different Git Repository</span>
            <span>Browse Templates</span>
          </div>
        </div>
        <div className='Right2'>
          <div className='cards'>
            <div className='Head'> Configure Project</div>
            <div className='Inputboxes' style={{'marginTop':"10px"}}><div style={{'fontWeight':"600",'color':"#6e6767"}}>Project Name</div><div className='INP'><input value={prname} onChange={(e)=>{setprname(e.target.value)}}/></div> </div>
            <div className='Inputboxes' style={{'marginTop':"10px"}}><div style={{'fontWeight':"600",'color':"#6e6767"}}>Repo URL</div><div className='INP'><input value={repoUrl} disabled='true'/></div> </div>
            <div className='Inputboxes' style={{'marginTop':"10px"}}><div style={{'fontWeight':"600",'color':"#6e6767"}}>Project Description</div><div className='INP'><input onChange={(e)=>{setprdes(e.target.value)}} value={prdes}/></div> </div>
            <div className='Inputboxes' style={{'marginTop':"10px"}}><div style={{'fontWeight':"600",'color':"#6e6767"}}>Project ID</div><div className='INP'><input onChange={(e)=>{setprId(e.target.value)}} value={prId}/></div> </div>
            <div className='Inputboxes' style={{'marginTop':"10px"}}><div style={{'fontWeight':"600",'color':"#6e6767"}}>Root Directory</div><div className='INP'><input value='./' disabled='true'/></div> </div>
            <div className='Button' onClick={DeployPr} >Deploy</div>
            </div>
        </div>
      </div>
    </div>
  )
}
