import React from 'react'
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react'


export default function Blogs() {

    const [userData, setUserData] = useState([]);
    const getData = async () => {
        try {
            const res = await fetch('/blog', {
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
    return (

        <div className='container my-3'>
            <h1 className='text-center fw-bolder'>Blogs Archive</h1>
            <p className="text-muted text-center">Choose a Blog to read full content</p>
            <div className="row">
                {userData.map((item) => (
                    <div className="col-md-6">
                        <div className="card shadow mx-auto my-5" >
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{item.topic}</h6>
                                <p className="card-text">{item.content ? item.content.slice(0,80) : ""}...</p>
                                <Link to={"/blogs/" + item._id} className="btn btn-sm btn-outline-primary rounded-pill">Read More</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}