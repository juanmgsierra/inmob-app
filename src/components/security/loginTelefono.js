import React, { Component } from "react";
import * as firebaseui from "firebaseui";
import {
  Container,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import LockOutlineIcon from "@material-ui/icons/LockOutlined";

const style = {
  paper: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: 5,
    backgroundColor: "red",
  },
  form: {
    width: "100%",
    marginTop: 8,
  },
  submit: {
    marginTop: 10,
    marginBottom: 20,
  },
  captcha: {
    flexGrow: 1,
    marginTop: 10,
  },
};

class loginTelefono extends Component {
  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutlineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingrese numero de telefono
          </Typography>
          <form style={style.form}>
            <Grid container style={style.captcha} justify="center">
              <div ref={(ref) => (this.recaptcha = ref)}></div>
            </Grid>
            <TextField
              variant="outlined"
              fullWidth
              name="telefono"
              label="Ingrese numero telefonico"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={style.submit}
            >
              Enviar
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default loginTelefono;
