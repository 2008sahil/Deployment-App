import logo from './logo.svg';
import './App.css';
// import { Home } from './Component/Home';
import {  BrowserRouter,Routes, Route,Router } from "react-router-dom";
import { HomePage } from './Component/Home/HomePage.js';
import { useEffect, useState } from 'react';
import { Navbar } from './Component/Navbar/Navbar.js';
import { ConfigProject } from './Component/CreateProject/ConfigProject.js';
import { Allproject } from './Component/AllProject/Allproject.js';
import { Deployment } from './Component/Deployment/Deployment.js';
import { Logs } from './Component/Logs/Logs.js';

function App() {
  const [auth ,setauth]=useState(null); 
  const [user ,setuser]=useState(null); 
  const Client_ID="1358438808b90040cd6f";


  useEffect(()=>{
    const queryString =window.location.search;
    const urlParams=new URLSearchParams(queryString);
    const codeParam=urlParams.get("code")

    if(codeParam &&!localStorage.getItem("auth") ){
      console.log("code param is ",codeParam)
      const getAccessToken=async ()=>{
        await fetch("http://localhost:4000/user/getAccessToken?code="+codeParam,{
          method:"GET"
        }).then((response)=>{
          return response.json()
        }).then((data)=>{
          console.log("auth token is",data)
          setauth(data.access_token)
          localStorage.setItem("auth",data.access_token)
        })
      }
      getAccessToken()
    }

    if(localStorage.getItem("auth")){
      console.log("auth is ",localStorage.getItem("auth"))
      const getuserinfo=async ()=>{
        await fetch("http://localhost:4000/user/userdata",{
          method:"GET",
          headers:{
            "authorization":"Bearer "+localStorage.getItem("auth")
          }
        }).then((response)=>{
          return response.json()
        }).then((data)=>{
          console.log("user data is ",data)
          setuser(data)
        })
      }
      getuserinfo()
    }
  },[])


  const Login=()=>{
    window.location.assign("https://github.com/login/oauth/authorize?client_id="+Client_ID+"&scope=repo")
  }
  return (
    <BrowserRouter>
    <Navbar click={Login} islogin={user} />
    <Routes>
      <Route path="/" element={<HomePage user={user} Login={Login} />} />
      <Route exact path="/configproject" element={<ConfigProject user={user} />} />
      <Route exact path="/project" element={<Allproject user={user} />} />
      <Route exact path="/Deployment" element={<Deployment user={user}/>}/>
      <Route exact path="/Logs" element={<Logs user={user}/>}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
