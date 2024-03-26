import React, { useEffect, useState } from 'react'
import './Deployment.css'
import githublogo from '../../Static/Images/github.svg'
import { useLocation } from 'react-router-dom';
import { DeploymentCard } from './DeploymentCard';

export const Deployment = ({user}) => {
    const [deployments,setdepolyments]=useState([])
    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const Project_id = searchParams.get('id');
  const Projectname=searchParams.get('project');
    useEffect(()=>{
        const fetchDeployments=async()=>{
            await fetch('http://localhost:4000/user/getDeployments',{
              method:"GET",
              headers:{
                'Content-Type': 'application/json',
                "authorization":Project_id
              }
            }).then((res)=>{return res.json()}).then((data)=>{console.log(data);setdepolyments(data)})
        }
        fetchDeployments();
    },[])

  return (
    <div className='Deployment'>
      <div className='TOP'>

        <div className='Head'>
          Deployments
        </div>
        <div className='Tagline'>
        <div className='Dull'>
          Continuously generated from<img className='icon' src={githublogo}/>
        </div>
        <div className='highlight'>{user&& user.username}/Amazon-clone-deploy</div>
        </div>
      </div>
      <div className='AllDeployments'>
        {deployments.map((deployment)=>{
           return <DeploymentCard key={deployment._id} username={user && user.username} deployment={deployment}/>
         })} 
      </div>
    </div>
  )
}
