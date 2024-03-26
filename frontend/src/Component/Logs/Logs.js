import React, { useEffect, useState } from 'react'
import './Logs.css'
import {  useLocation } from 'react-router-dom';
import githublogo from '../../Static/Images/github.svg'
import branch from '../../Static/Images/branch.jpg'
import io from "socket.io-client";
const ENDPOINT="http://localhost:4000/"
var socket

export const Logs = ({user}) => {
    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const Deploymentid = searchParams.get('id');
  const Projectname=searchParams.get('repoName');
  
  const [logs,setlogs]=useState([])
  const [ProjectId,setProjectId]=useState("")


  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("subscribe",`logs:${Deploymentid}`)
    socket.on('message',(data)=>{console.log(data)})

    const fetchDeployments=async()=>{
        await fetch('http://localhost:4000/user/getDeployment',{
          method:"GET",
          headers:{
            'Content-Type': 'application/json',
            "authorization":Deploymentid
          }
        }).then((res)=>{return res.json()}).then((data)=>{setProjectId(data[0].projectId.ProjectId);setlogs(data[0].logs)})
    }
    fetchDeployments();

  },[])
  useEffect(()=>{
    socket.on('logs',(data)=>{
      console.log(data)
      setlogs([...logs,data]);
    })
  })
  return (
    <div className='Logs'>
        <div className='TOP'>
        <div>Web Service</div>
        <div className="PROJECT">{Projectname}</div>
        <div className="User"><img className="icon" src={githublogo}/><div>{user&& user.username}/{Projectname}</div><div className='branch'><img className='icon' src={branch}/>main</div></div>
        <div className='URL'><a href={`http://${ProjectId}.localhost:8000`} target="_blank">{ProjectId}.localhost:8000</a></div>
        </div>
        <div className='LogsHead'>Logs</div>
        <div className='BOX'>
            {logs.map((log)=>{
                return <div>-{log}</div>
            })}
        </div>
        

    </div>
  )
}
