import "./index.css";
import React from "react";
import { useState, useEffect } from "react";

import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

import EditIcon from "@material-ui/icons/Edit";
import { Link as RouteLink } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "150%",
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Main = () => {
  //logs out user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("key");

    window.location.reload();
  };

  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [webusername, SetWebUsername] = useState("");
  const [passwordArray, setPasswordArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogWebusername, setDialogWebusername] = useState("");
  const [dialogPassword, setDialogPassword] = useState("");
  const [editPassword, setEditPassword] = useState(false);
  const [editedPassword, setEditedPassword] = useState("");
  const [editedwebusername, setEditedWebUsername] = useState("");

  //Deletes password from database
  const handleDeletePassword = (item) => {
    Axios.delete("api/posts", {
      params: {
        _id: item._id,
      },
    });
    window.location.reload();
  };

  const handleEditPassword = (item) => {
    setEditPassword(true);
  };

  //shows the dialog box
  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setDialogWebusername(item.webusername);
    setDialogTitle(item.website);
    setDialogPassword(item.password);
    setDialogOpen(true);
  };

  const handleSavePassword = () => {
    const username = localStorage.getItem("token");
    const key = localStorage.getItem("key");

    Axios.put("api/posts", null, {
      params: {
        _id: selectedItem._id,
        username: username,
        webusername: editedwebusername || selectedItem.webusername,
        password: editedPassword || selectedItem.password,
        key: key,
      },
    });

    window.location.reload();
  };
  //closes the dialog box
  const handleCloseDialog = () => {
    setDialogWebusername("");
    setDialogOpen(false);
    setDialogTitle("");
    setDialogPassword("");
    setEditPassword(false);
  };

  //runs when page is loaded
  useEffect(() => {
    const username = localStorage.getItem("token");

    Axios.get("api/posts", {
      params: {
        username: username,
      },
    }).then((res) => {
      const decrptpasswords = res.data.map((item) => {
        decrptpass(item);
        return item;
      });

      setPasswordArray(decrptpasswords);
    });
  }, []);
  //adds password to database
  const addPassword = () => {
    if (title === "" || password === "") {
      alert("Please fill all fields");
      return;
    }
    setTitle("");
    setPassword("");

    const username = localStorage.getItem("token");

    const key = localStorage.getItem("key");

    Axios.post("api/posts", null, {
      params: {
        username: username,
        title: title,
        webusername: webusername,
        password: password,
        key: key,
      },
    });

    window.location.reload();
  };
  //decrypts password
  const decrptpass = (item) => {
    const key = localStorage.getItem("key");
    Axios.post("api/decrypt", null, {
      params: { password: item.password, iv: item.iv, key: key },
    }).then((res) => {
      item.password = res.data;
    });
  };

  //the search bar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  let filteredPasswords = [];
  if (passwordArray.length > 0) {
    filteredPasswords = passwordArray.filter((item) => {
      return item.website.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  return (
    <div>
      <AppBar>
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
      <div className="Home">
        <form className="AddingPassword">
          <TextField
            id="outlined-basic"
            label="ex. YouTube"
            variant="outlined"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            value={title}
            required
          />
          <TextField
            id="outlined-basic"
            label="ex. Email"
            variant="outlined"
            onChange={(event) => {
              SetWebUsername(event.target.value);
            }}
            value={webusername}
            required
          />
          <TextField
            id="outlined-basic"
            label="ex. Password"
            variant="outlined"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
            required
          />{" "}
          <Button variant="contained" onClick={addPassword}>
            Add password
          </Button>
        </form>

        <div className="SearchBar">
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <Button component={RouteLink} to="/checker">
          Check weak passwords
        </Button>
        <div className={classes.root}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem>
              <ListItemText primary="Website" />
              <ListItemText primary="|" />
              <ListItemText primary="Username" />

              <ListItemText />
            </ListItem>
            {filteredPasswords.map((item) => (
              <ListItem
                button
                key={item._id}
                onClick={() => handleOpenDialog(item)}
              >
                <ListItemText primary={item.website} />
                <ListItemText primary={item.webusername} />
              </ListItem>
            ))}
          </List>
        </div>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          {editPassword ? (
            <div>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogContent>
                <TextField
                  required
                  id="outlined-required"
                  label="New Username"
                  defaultValue={dialogWebusername}
                  onChange={(event) => {
                    setEditedWebUsername(event.target.value);
                  }}
                />
                <TextField
                  required
                  id="outlined-required"
                  label="New Password"
                  defaultValue={dialogPassword}
                  onChange={(event) => {
                    setEditedPassword(event.target.value);
                  }}
                />
                <DialogActions>
                  <Button onClick={handleSavePassword}>Save</Button>
                  <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
              </DialogContent>
            </div>
          ) : (
            <div>
              {" "}
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Username: {dialogWebusername}
                </DialogContentText>
                <DialogContentText>
                  Password: {dialogPassword}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <IconButton onClick={() => handleEditPassword(selectedItem)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeletePassword(selectedItem)}>
                  <DeleteIcon />
                </IconButton>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default Main;
