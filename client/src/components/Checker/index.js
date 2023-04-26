import React, { useState, useEffect } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { AppBar, Toolbar, Box, Link, Button } from "@material-ui/core";
const useStyles = makeStyles({
  root: {
    maxWidth: 600,
    margin: "0 auto",
  },
  title: {
    margin: "24px 0",
  },
});

const Checker = () => {
  const classes = useStyles();
  const [weakPasswords, setWeakPasswords] = useState([]);
  //logs out user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("key");

    window.location.reload();
  };
  //runs when page is loaded and checks for weak passwords
  useEffect(() => {
    const username = localStorage.getItem("token");

    Axios.get("/api/posts", {
      params: {
        username: username,
      },
    }).then((res) => {
      const weakpass = res.data.filter((password) => {
        return password.score < 2;
      });
      setWeakPasswords(weakpass);
    });
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
      <div className={classes.root}>
        {weakPasswords.length === 0 ? (
          <Typography variant="h4" component="h2" className={classes.title}>
            Looks like you don't have any weak passwords! Good job!
          </Typography>
        ) : (
          <div>
            <Typography variant="h4" component="h2" className={classes.title}>
              Your Weak Passwords:
            </Typography>

            <List>
              {weakPasswords.map((password) => (
                <ListItem key={password._id}>
                  <Typography>{password.website}</Typography>
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </div>
    </>
  );
};

export default Checker;
