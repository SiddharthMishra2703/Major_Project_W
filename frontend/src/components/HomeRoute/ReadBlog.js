import React from 'react'
// import { Link } from "react-router-dom";
import { useEffect, useState } from 'react'


export default function Blogs() {
  const url = window.location.href;
  const blogId = url.slice(-24);
  const [userData, setUserData] = useState({});
  const getData = async () => {
    try {
      const res = await fetch('/blog/' + blogId, {
        method: "GET",
        headers: {
          Accept: "appllication/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await res.json();
      setUserData(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  const blog = userData;
  
  return (

      <div className="card w-50 shadow mx-auto my-5" >
        <div className="card-body">
          <h5 className="card-title">{blog.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{blog.topic}</h6>
          <p className="card-text">{blog.content}</p>
        </div>
      </div>
  )
}