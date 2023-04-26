import React, { useState } from "react";
import "./generator.css";
import { Typography } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import { Box, Button, IconButton } from "@material-ui/core";

//User interface inspired by Future Coders (https://www.youtube.com/watch?v=YpTmcCBBdTE&list=WL&index=10&ab_channel=FutureCoders)

const Gen = () => {
  const [password, setPasword] = useState("");
  const [passwordLen, setPasswordLen] = useState(10);
  const [uppercase, setuppercase] = useState(false);

  const [numbers, setnumbers] = useState(false);
  const [symbols, setsymbols] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("key");

    window.location.reload();
  };

  const GeneratePass = (p) => {
    let charrList = "abcdefghijklmnopqrstuvwxyz";
    if (uppercase) {
      charrList = charrList + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (numbers) {
      charrList = charrList + "0123456789";
    }
    if (symbols) {
      charrList = charrList + "!£$%^&*()_+{}:@~<>?-=[];'#,./";
    }

    setPasword(makePass(charrList));
  };

  const makePass = (chars) => {
    let pass = "";
    const charslen = chars.length;

    for (let index = 0; index < passwordLen; index++) {
      const charindex = Math.round(Math.random() * charslen);
      pass = pass + chars.charAt(charindex);
    }
    return pass;
  };

  const copyPassword = (r) => {
    navigator.clipboard.writeText(password);
  };

  return (
    <Box component="div" bgcolor="blue">
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
      <Container maxWidth="xs">
        <div className="generator">
          <h2 className="generator_header">Password Generator</h2>
          <div className="generator_password">
            <Typography
              varient="h3"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100px",
              }}
            >
              {password}
            </Typography>
            <IconButton onClick={copyPassword} aria-label="delete" size="small">
              <AssignmentIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="form-group">
            <Typography varient="h2">Password length</Typography>

            <Input
              defaultValue={passwordLen}
              onChange={(v) => setPasswordLen(v.target.value)}
              type="number"
              id="password-strength"
              name="password-strength"
              max="32"
              min="8"
            ></Input>
          </div>
          <FormGroup>
            <FormControlLabel
              value="Uppercase Letters"
              control={
                <Checkbox
                  color="primary"
                  checked={uppercase}
                  onChange={(v) => setuppercase(v.target.checked)}
                  name="uppercase-letters"
                />
              }
              label="Uppercase"
            />
            <FormControlLabel
              value="Numbers"
              control={
                <Checkbox
                  color="primary"
                  checked={numbers}
                  onChange={(v) => setnumbers(v.target.checked)}
                  name="include-numbers"
                />
              }
              label="Numbers"
            />
            <FormControlLabel
              value="Symbols"
              control={
                <Checkbox
                  color="primary"
                  checked={symbols}
                  onChange={(v) => setsymbols(v.target.checked)}
                  name="include-symbols"
                />
              }
              label="Symbols"
            />
          </FormGroup>
          <Button variant="contained" onClick={GeneratePass}>
            Generate Password
          </Button>
        </div>
      </Container>
    </Box>
  );
};

export default Gen;
