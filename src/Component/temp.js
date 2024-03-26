import React, { useEffect, useState } from 'react'




export const Home = () => {
const [auth ,setauth]=useState(null)

  useEffect(()=>{
    const queryString =window.location.search;
    const urlParams=new URLSearchParams(queryString);
    const codeParam=urlParams.get("code")
    // console.log(codeParam)
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
        })
      }
      getuserinfo()
    }


  },[])



  const Client_ID="1358438808b90040cd6f";
  const Login=()=>{
    window.location.assign("https://github.com/login/oauth/authorize?client_id="+Client_ID)
  }
    



  return (
    <div>
      <div onClick={Login}>Login To github</div>

    </div>

  )
}
