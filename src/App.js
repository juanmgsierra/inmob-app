import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import "./App.css";
import ListaInmuebles from "./components/views/ListaInmuebles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
import AppNavbar from "./components/layout/AppNavbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Registro from './components/security/Registro'

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />
          <Grid container>
            <Switch>
              <Route path="/" exact component={ListaInmuebles}></Route>
              <Route path="/auth/register" exact component={Registro}></Route>
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
