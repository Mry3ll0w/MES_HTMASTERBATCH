import React, { useState } from "react";
import axios from "axios";
export default function PhotoUploader({ url }) {
  const [file, setFile] = useState({ data: "" });

  function handleChange(e) {
    const img = {
      data: e.target.files[0],
    };
    setFile(img);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", file.data);
    axios
      .post(`http://${process.env.REACT_APP_SERVER}${url}`, formData)
      .catch((e) => console.log(e));
  };

  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
        <input type='file' onChange={handleChange} />
        <button type='submit'>Upload</button>
      </form>
    </div>
  );
}
