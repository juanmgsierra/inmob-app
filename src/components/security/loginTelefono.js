import React, { Component } from "react";
import * as firebaseui from "firebaseui";
import {
  Container,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import LockOutlineIcon from "@material-ui/icons/LockOutlined";
import { consumerFirebase } from "../../server";
import {StateContext} from '../../sesion/store';
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";

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
    marginTop: 10
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
  static contextType = StateContext;
  state = {
    disable:true,
    dialogAbierto:false,
    codigoConfirmacion:'',
    usuario:{
      telefono:'',
      codigo: ''
    }
  }

  componentDidMount(){
    const {firebase} = this.props;
    firebase.auth.languageCode = "es";
    window.recaptchaVerifier = new firebase.authorization.RecaptchaVerifier(
      this.recaptcha,
      {
        size:"normal",
        callback: response => {
          this.setState({
            disable:false
          })
        },
        "expired-callback" : function(){
          this.setState({
            disable: true
          })
        }
      }
    )
    window.recaptchaVerifier.render().then(() => (widgetId) =>{
      window.recaptchaVerifier = widgetId
    });
  }

  verificarNumero = e =>{
    e.preventDefault();
    const [ {usuario},dispatch] = this.context;
    const {firebase} = this.props;
    const appVerificacion = window.recaptchaVerifier;
    firebase.auth.signInWithPhoneNumber(this.state.usuario.telefono,appVerificacion)
    .then(codigoEnviado => {
      this.setState({
        dialogAbierto:true,
        codigoConfirmacion: codigoEnviado
      })
    }).catch(error=>{
      openMensajePantalla(dispatch,{
        open:true,
        mensaje:error.message
      })      
    })
    
  }

  onChange = e => {
    let usuario = Object.assign({}, this.state.usuario);
    usuario[e.target.name] = e.target.value;
    this.setState({usuario})
  }

  loginConTelefono = () => {
    const {firebase} = this.props;
    const [ {usuario},dispatch] = this.context;
    let credencial = firebase.authorization.PhoneAuthProvider.credential(this.state.codigoConfirmacion.verificationId, this.state.usuario.codigo)
    firebase.auth.signInAndRetrieveDataWithCredential(credencial)
    .then(authUser => {
      firebase.db.collection("Users")
      .doc(authUser.user.uid)
      .set({
        id: authUser.user.uid,
        telefono: authUser.user.phoneNumber
      }, {merge:true})
      .then(success=>{
        firebase.db
        .collection("Users")
        .doc(authUser.user.uid)
        .get()
        .then(doc=>{
          dispatch({
            type:"INICIAR_SESION",
            sesion: doc.data(),
            autenticado: true
          })
          this.props.history.push("/");
        })
        
      })
    }).catch(error=>{
      openMensajePantalla(dispatch,{
        open:true,
        mensaje:error.message
      })      
    })

  }
  render() {
    return (
      <Container maxWidth="xs">
        <Dialog open={this.state.dialogAbierto} onClose={()=>{ this.setState({ dialogAbierto:false })}} >
          <DialogTitle>Ingrese su codigo</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingrese el codigo que recibio por mensaje de texto
            </DialogContentText>
            <TextField autoFocus margin="dense" name="codigo" value={this.state.codigo} onChange={this.onChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={()=>{ this.setState({ dialogAbierto:false })}}>Cancelar</Button>
            <Button color="primary" onClick={this.loginConTelefono}>Verificar</Button>
          </DialogActions>
        </Dialog>
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
            <br/>
            <TextField
              variant="outlined"
              fullWidth
              name="telefono"
              label="Ingrese numero telefonico"
              value={this.state.usuario.telefono}
              onChange={this.onChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={style.submit}
              onClick={this.verificarNumero}
              disabled ={this.state.disable}
            >
              Enviar
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default consumerFirebase(loginTelefono);
