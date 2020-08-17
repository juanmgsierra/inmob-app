import React, { Component } from 'react';
import { Container, Paper, Breadcrumbs, Link, TextField, Typography, Grid, Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { consumerFirebase } from '../../server';
import HomeIcon from '@material-ui/icons/Home'
import ImageUploader from 'react-images-upload';
import uuid from 'uuid';
import { crearKeyword } from '../../sesion/actions/Keyword';
const style = {
    container: {
        paddingTop: '8px'
    },
    paper: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5"
    },
    link: {
        padding: "20px",
        backgroundColor: "#f5f5f5"
    },
    homeIcon: {
        width: 20,
        height: 20,
        marginRight: "4px"
    },
    submit: {
        marginTop: 15,
        marginBottom: 10
    },
    fotoInmueble: {
        height: "100px"
    }
}
class EditarInmueble extends Component {

    state = {
        inmueble: {
            direccion: "",
            ciudad: "",
            pais: "",
            descripcion: "",
            interior: "",
            fotos: []
        }
    }

    cambiarDato = e => {
        let inmueble = Object.assign({}, this.state.inmueble);
        inmueble[e.target.name] = e.target.value;
        this.setState({ inmueble });
    }

    subirImagenes = imagenes => {
        const { inmueble } = this.state;
        const { id } = this.props.match.params;
        Object.keys(imagenes).forEach(key => {
            let codigoDinamico = uuid.v4();
            let nombreImagen = imagenes[key].name;
            let extension = nombreImagen.split(".").pop();
            imagenes[key].alias = (nombreImagen.split(".")[0] + "_" + codigoDinamico + "_" + extension)
        })
        this.props.firebase.guardarDocumentos(imagenes).then(urlImagenes => {
            inmueble.fotos = inmueble.fotos.concat(urlImagenes);
            this.props.firebase.db
                .collection("Inmuebles")
                .doc(id)
                .set(inmueble, { merge: true })
                .then(success => {
                    this.setState({
                        inmueble
                    })
                })
        })
    }

    eliminarFoto = fotoURL => async () => {
        
        const {inmueble} = this.state;
        const {id} = this.props.match.params;
        let fotoID = fotoURL.match(/[\w-]+.(jgp|png|jepg|gif|svg)/);
        fotoID = fotoID[0];
        await this.props.firebase.eliminarDocumento(fotoID);

        let fotoList = this.state.inmueble.fotos.filter(foto => {
            return foto !== fotoURL;
        })

        inmueble.fotos = fotoList;
        this.props.firebase.db
        .collection("Inmuebles")
        .doc(id)
        .set(inmueble,{merge:true})
        .then(success=> {
            this.setState({
                inmueble
            })
        })
    }

    guardarInmueble = () => {
        const {inmueble} = this.state;
        const {id} = this.props.match.params;

        const textoBusqueda = inmueble.direccion + " " + inmueble.ciudad + " " + inmueble.pais;
        const keyWords = crearKeyword(textoBusqueda);

        inmueble.keywords = keyWords;
        inmueble.propietario = this.props.firebase.auth.currentUser.uid;
        this.props.firebase.db
        .collection("Inmuebles")
        .doc(id)
        .set(inmueble, {merge:true})
        .then(success => {
            this.props.history.push("/")
        })

    }

    async componentDidMount() {
        const { id } = this.props.match.params;

        const inmuebleCollection = this.props.firebase.db.collection("Inmuebles");
        const inmuebleDB = await inmuebleCollection.doc(id).get();

        this.setState({
            inmueble: inmuebleDB.data()
        })
    }

    render() {
        let imagenKey = uuid.v4();
        return (
            <Container style={style.container}>
                <Paper style={style.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" style={style.link} href="/">
                                    <HomeIcon style={style.homeIcon} />
                                    Home
                                </Link>
                                <Typography color="textPrimary">Editar Inmueble</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="direccion"
                                label="Direccion del inmueble"
                                fullWidth
                                value={this.state.inmueble.direccion}
                                onChange={this.cambiarDato}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="ciudad"
                                label="Ciudad"
                                fullWidth
                                value={this.state.inmueble.ciudad}
                                onChange={this.cambiarDato}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="pais"
                                label="Pais"
                                fullWidth
                                value={this.state.inmueble.pais}
                                onChange={this.cambiarDato}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="descripcion"
                                label="Descripcion del inmueble"
                                fullWidth
                                multiline
                                value={this.state.inmueble.descripcion}
                                onChange={this.cambiarDato}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="interior"
                                label="Interior del inmueble"
                                fullWidth
                                multiline
                                value={this.state.inmueble.interior}
                                onChange={this.cambiarDato}
                            />
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12} sm={6} >
                                <ImageUploader
                                    key={imagenKey}
                                    withIcon={true}
                                    buttonText="Seleccione su imagen"
                                    onChange={this.subirImagenes}
                                    imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Table>
                                    <TableBody>
                                        {
                                            this.state.inmueble.fotos
                                                ? this.state.inmueble.fotos.map((foto, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell align="left">
                                                            <img src={foto} style={style.fotoInmueble} />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                onClick={this.eliminarFoto(foto)}
                                                            >
                                                                Eliminar
                                                        </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )) : ""
                                        }
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12} sm={6}>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    color="primary"
                                    style={style.submit}
                                    onClick={this.guardarInmueble}
                                >
                                    Guardar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        )
    }
}

export default consumerFirebase(EditarInmueble);