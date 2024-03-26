import React, { useEffect, useState } from 'react'
import './Allproject.css'
import { ProjectCard } from './ProjectCard'

export const Allproject = ({user}) => {
  const [Project,setProject]=useState([])
  useEffect(()=>{
    const fetchProject=async()=>{
      await fetch('http://localhost:4000/user/getProject',{
        method:"GET",
        headers:{
          "authorization":user._id
        }
      }).then((data)=>{return data.json()}).then((data)=>{setProject(data)})
    }
    user && fetchProject();

  },[user])
  return (
    <div>
        <div className='navigation'>
            <div style={{"borderBottom":"3px solid black"}}><div className='hover'>Overview</div></div>
            <div className='hover'>Integration</div>
            <div className='hover'>Activity</div>
            <div className='hover'>Domains</div>
            <div className='hover'>Usage</div>
            <div className='hover'>Monitoring</div>
            <div className='hover'>Storage</div>
            <div className='hover'>AI</div>
            <div className='hover'>Settings</div>
        </div>
        <div className='AllProject'>{user&& `${user.username}/Project`}</div>
        <div className='UserProject'>
          {Project.map((project)=>{
            return <ProjectCard  key={project._id} project_id={project._id} username={user.username} projectname={project.name} projectId={project.ProjectId}/>
          })}
        </div>
    </div>
  )
}
