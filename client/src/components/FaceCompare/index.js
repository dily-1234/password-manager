import React, { useState } from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import Webcam from "react-webcam";
import axios from "axios";

const FaceCompare = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [token, setToken] = useState("");
  const webcamRef = React.useRef(null);
  // When the user takes a picture this runs the code to comaare the picture to the one in the database
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    const username = localStorage.getItem("id");

    axios
      .post("/api/facecompare", { imageData: imageSrc, username: username })
      .then((response) => {
        if (response.data.result) {
          localStorage.removeItem("id");
          localStorage.setItem("token", response.data.data);
          window.location = "/";
        }
      });
  }, [webcamRef]);
  // This runs when the user enters the token if they cant verify with the camera
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = localStorage.getItem("id");

    axios
      .post("/api/facecompare", { token: token, username: username })
      .then((response) => {
        if (response.data.result) {
          localStorage.removeItem("id");
          localStorage.setItem("token", response.data.data);
          window.location = "/";
        }
      });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        {imgSrc ? (
          <img src={imgSrc} alt="img" />
        ) : (
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        )}
        <Button variant="contained" color="primary" onClick={capture}>
          Capture photo
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>If camera does not work enter your token</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Token"
            variant="outlined"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default FaceCompare;
