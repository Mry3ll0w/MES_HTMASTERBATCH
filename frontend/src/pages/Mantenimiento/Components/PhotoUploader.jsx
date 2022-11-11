import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import DropDownMenu from "../../../Components/DropDownMenu";
export default function PhotoUploader({ url, label, CallBackFunction }) {
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

  const aDropElements = [
    {
      element: (
        <form onSubmit={handleSubmit}>
          <input type='file' onChange={handleChange} />
          <br />
          <Button variant='contained' type='submit' sx={{ marginTop: "2%" }}>
            Subir Imagen
          </Button>
        </form>
      ),
    },
  ];

  return (
    <div className='App'>
      <DropDownMenu label={label} elements={aDropElements} />
    </div>
  );
}
