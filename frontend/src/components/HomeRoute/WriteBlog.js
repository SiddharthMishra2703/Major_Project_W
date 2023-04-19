import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function TextForm() {

  const navigate = useNavigate();

  const handleUpClick = () => {
    let newtext = text.content.toUpperCase();
    setText(newtext);
  }

  const handleLoClick = () => {
    let newtext = text.content.toLowerCase();
    setText(newtext);
  }

  const handleFirstClick = () => {
    if (text === text.toUpperCase()) {
      let newtext = text.content.charAt() + text.content.slice(1).toLowerCase();
      setText(newtext);
    }
    else {
      let nt = text.content.charAt();
      let newtext = nt.toUpperCase() + text.content.slice(1);
      setText(newtext);
    }
  }

  const handleClearClick = () => {
    let newtext = "";
    setText(newtext);
  }

  const selectTextClick = () => {
    var text = document.getElementById('MyBox');
    text.select();
    navigator.clipboard.writeText(text.value);
  }

  const [text, setText] = useState({
    title: "",
    topic: "",
    content: "",
  });

  let name, value;
  const handleOnChange = (e) => {
    // console.log("Clicked");
    // console.log(e);
    name = e.target.name;
    value = e.target.value;

    setText({ ...text, [name]: value });
  }

  // Fetch Api
  const PostData = async (e) => {
    e.preventDefault();

    const { title, topic, content } = text;

    try {
      
      const res = await fetch('/writeblog', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          topic,
          content
        })
      });
  
      const data = await res.json();
  
      if (res.status === 422 || !data) {
        window.alert("Invalid Blog");
        console.log("Invalid Blog");
      } else {
        window.alert("Blog saved successfuly");
        console.log("Blog saved successfuly");
  
        navigate('/dashboard');
      }

    } catch (err) {
      console.log(err);
      navigate('/login');
    }
  }

  return (
    <>
      <div className='container'>
        <h1 className='text-center fw-bolder my-4'> Create Your Own Blog</h1>
        <form method="POST">
        <div className="row my-4">
          <div className="col-6">
            <div className="input-group flex-nowrap">
              <input type="text" className="form-control" placeholder="Enter Title" value={text.title} name='title' onChange={handleOnChange} aria-label="Username" aria-describedby="addon-wrapping" />
            </div>
          </div>
          <div className="col-6">
            <select className="form-select" value={text.topic} name='topic' onChange={handleOnChange} aria-label="Default select example">
              <option selected>Open this select menu</option>
              <option value="Fashion">Fashion</option>
              <option value="Sports">Sports</option>
              <option value="Technology">Technology</option>
              <option value="Science And Devlopment">Science And Devlopment</option>
              <option value="Politices">Politices</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          {/* <label htmlFor="MyBox" className="form-label">Example textarea</label> */}
          <textarea className="form-control" value={text.content} name='content' onChange={handleOnChange} id="MyBox" rows="10"></textarea>
        </div>
        </form>
        <button className="btn btn-primary mx-2 my-1" onClick={handleUpClick}>Convert To UpperCase</button>
        <button className="btn btn-primary mx-2 my-1" onClick={handleLoClick}>Convert To LowerCase</button>
        <button className="btn btn-primary mx-2 my-1" onClick={handleFirstClick}>First Letter Capital</button>
        <button className="btn btn-primary mx-2 my-1" onClick={selectTextClick}>Select All</button>
        <button className="btn btn-primary mx-2 my-1" onClick={handleClearClick}>Clear</button>
        <button className="btn btn-primary mx-2 my-1" onClick={PostData}>Save</button>
      </div>
      {/* <div className="container my-3">
        <h1>Text Summary</h1>
        <p>{text.split(" ").filter((element) => { return element.length !== 0 }).length} Words and {text.length} Characters</p>
        <h2>Preview</h2>
        <p>{text.length > 0 ? text : 'Write Something to preview!'}</p>
      </div> */}
    </>
  )
}

