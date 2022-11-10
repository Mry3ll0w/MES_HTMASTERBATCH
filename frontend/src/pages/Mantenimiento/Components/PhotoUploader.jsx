import React, { useState } from "react";
import axios from "axios";
export default function PhotoUploader({ url }) {
  const [file, setFile] = useState();

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    // `http://${process.env.REACT_APP_SERVER}${url}`
  }

  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
        <input type='file' onChange={handleChange} />
        <button type='submit'>Upload</button>
      </form>
    </div>
  );
}
