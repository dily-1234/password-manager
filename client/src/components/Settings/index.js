import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import Typography from "@material-ui/core/Typography";
import "./settings.css";
import { AppBar, Toolbar, Box, Link, Button } from "@material-ui/core";

const Settings = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [file, setFile] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [hasFacePicture, setHasFacePicture] = useState(false);

  const webcamRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("key");
    window.location.reload();
  };

  const handleFileUpload = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleCsvSubmit = async () => {
    const username = localStorage.getItem("token");
    const key = localStorage.getItem("key");
    if (!csvFile) {
      alert("Please choose a CSV file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("csvFile", csvFile);
    const endpointUrl = `/api/csv?key=${key}&username=${username}`;
    try {
      const response = await axios.post(endpointUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`${response.data.length} passwords added successfully`);
    } catch (error) {
      console.error(error);
      alert("Error uploading CSV file");
    }
    setCsvFile(null);
  };

  const handleCapturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert("Please take a picture to upload");
      return;
    }
    const blob = await fetch(imageSrc).then((res) => res.blob());
    setFile(blob);
    setShowWebcam(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please take a picture to upload");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    const username = localStorage.getItem("token");
    const token = crypto.getRandomValues(new Uint32Array(1))[0];
    const endpointUrl = `/api/image?username=${username}&token=${token}`;
    const response = await axios.post(endpointUrl, formData);
    alert(`PLEASE KEEP THIS SAFE: ${token}`);
    setFile(null);
    setShowWebcam(false);
    setHasFacePicture(true);
  };

  const handleRetakePhoto = () => {
    setShowWebcam(true);
    setHasFacePicture(false);
  };

  const handleDeletePhoto = async () => {
    const username = localStorage.getItem("token");
    const endpointUrl = `/api/image?username=${username}`;
    try {
      const response = await axios.delete(endpointUrl);
      setHasFacePicture(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkFacePicture = async () => {
      const username = localStorage.getItem("token");
      const endpointUrl = `/api/image?username=${username}`;
      try {
        const response = await axios.get(endpointUrl);
        setHasFacePicture(response.data.hasFacePicture);
      } catch (error) {
        console.error(error);
      }
    };
    checkFacePicture();
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Link href="/" color="inherit">
              Home
            </Link>
            <Link href="/gen" color="inherit">
              Generator
            </Link>
            <Link href="/settings" color="inherit">
              Settings
            </Link>
            <Button onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Typography variant="h2" className="title">
        Settings
      </Typography>
      <div className="upload-csv">
        <Typography variant="h6" className="upload-csv-title">
          Please upload your CSV file here which contains your passwords.
        </Typography>
        <Box mt={2} display="flex" flexDirection="column">
          <Button variant="contained" component="label">
            Choose file
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={handleCsvSubmit}
              disabled={!csvFile}
              className="upload-csv-button"
            >
              Upload
            </Button>
          </Box>
        </Box>
      </div>
      <div className="face-id">
        <Box mt={4}>
          {hasFacePicture ? (
            <>
              <Typography variant="h6" className="upload-csv-title">
                To disable face recognition, please delete your face picture.
              </Typography>{" "}
              <Box display="flex" alignItems="center">
                <Typography variant="h6" className="upload-csv-title">
                  You already have a face picture in the database.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRetakePhoto}
                  className="retake-picture-button"
                >
                  Retake Picture
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDeletePhoto}
                  className="retake-picture-button"
                >
                  Delete Picture
                </Button>
              </Box>
            </>
          ) : (
            <Box mt={2} display="flex" flexDirection="column">
              <Typography variant="h6">
                To enbale face recognition, please take a picture of yourself.
              </Typography>
              {showWebcam && (
                <Box>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={320}
                    height={240}
                  />
                </Box>
              )}

              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowWebcam(true);
                    handleCapturePhoto();
                  }}
                  className="take-picture-button"
                  disabled={hasFacePicture}
                >
                  Take Picture
                </Button>
              </Box>
              {file && <img src={URL.createObjectURL(file)} alt="" />}
              <Box mt={2}>
                <form onSubmit={handleSubmit}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!file}
                    className="take-picture-button"
                  >
                    Upload
                  </Button>
                </form>
              </Box>
            </Box>
          )}
        </Box>
      </div>
    </>
  );
};

export default Settings;
