import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import "./App.css";
import ListaInmuebles from "./components/views/ListaInmuebles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
import AppNavbar from "./components/layout/AppNavbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Registro from "./components/security/Registro";
import login from "./components/security/login";
import { FirebaseContext } from "./server";
import { useStateValue } from "./sesion/store";
import { Snackbar } from "@material-ui/core";


function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [autenticacionIniciada, setupFirebaseInicial] = React.useState(false);

  const [{ openSnackbar }, dispatch] = useStateValue();

  useEffect(() => {
    firebase.isStarted().then((val) => {
      setupFirebaseInicial(val);
    });
  });

  return autenticacionIniciada !== false ? (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar ? openSnackbar.open : false}
        autoHideDuration={3000}
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        message={
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: "",
            },
          })
        }
      ></Snackbar>
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />
          <Grid container>
            <Switch>
              <Route path="/home" exact component={ListaInmuebles}></Route>
              <Route path="/auth/register" exact component={Registro}></Route>
              <Route path="/auth/login" exact component={login}></Route>
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  ) : null;
}

export default App;
