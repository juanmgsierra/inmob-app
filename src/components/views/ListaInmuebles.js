import React, { Component } from "react";
import { Link, Container, Paper, Grid, Breadcrumbs, Typography, TextField, CardMedia, Card, CardContent, CardActions, Button, ButtonGroup } from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home'
import { consumerFirebase } from "../../server";
import logo from '../../logo.svg'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import { obtenerData, obtenerDataAnterior } from "../../sesion/actions/inmuebleActions";


const style = {
    cardGrid: {
        paddingTop: 8,
        paddingBottom: 8
    },
    paper: {
        backgroundColor: '#f5f5f5',
        padding: '20px',
        minHeight: 650
    },
    link: {
        display: 'flex'
    },
    gridTextfield: {
        marginTop: "20px"
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    cardMedia: {
        paddingTop: "56.25%"
    },
    cardContent: {
        flexGrow: 1
    },
    barraBoton:{
        marginTop:'20px'
    }
}

class ListaInmuebles extends Component {

    state = {
        inmuebles: [],
        busquedaText: "",
        paginas: [],
        paginaSize: 1,
        casaInicial: null,
        paginaActual: 0
    }

    cambiarBusquedaTexto = e => {
        const self = this;
        self.setState({
            [e.target.name]: e.target.value
        })

        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout)
        }

        self.setState({
            name: e.target.value,
            tying: false,
            typingTimeout: setTimeout(goTime => {
                let objectQuery = this.props.firebase.db
                    .collection("Inmuebles")
                    .orderBy("direccion")
                    .where("keywords", "array-contains", self.state.busquedaText.toLowerCase())

                if (self.state.busquedaText.trim() === "") {
                    objectQuery = this.props.firebase.db
                        .collection("Inmuebles")
                        .orderBy("direccion");
                }

                objectQuery.get().then(snapshot => {
                    const arrayInmueble = snapshot.docs.map(doc => {
                        let data = doc.data();
                        let id = doc.id;
                        return { id, ...data }
                    })
                    this.setState({
                        inmuebles: arrayInmueble
                    })
                })
            }, 500)
        })
    }

    eliminarInmueble = id => {
        this.props.firebase.db
            .collection("Inmuebles")
            .doc(id)
            .delete()
            .then(success => {
                this.eliminarInmuebleList(id);
            })
    }

    eliminarInmuebleList = id => {
        const inmuebleListaNueva = this.state.inmuebles.filter(
            inmueble => inmueble.id !== id
        )

        this.setState({
            inmuebles: inmuebleListaNueva
        })
    }

    editarInmueble = id => {
        this.props.history.push('/inmueble/' + id)
    }

    anteriorPagina = () => {
        const {paginaActual, paginaSize, busquedaText, paginas} = this.state;
        

        if(paginaActual > 0){
            const firebase = this.props.firebase;
            obtenerDataAnterior(firebase, paginaSize, paginas[paginaActual - 1].inicialValor, busquedaText ).then(firebaseReturnData =>{

                const pagina = {
                    inicialValor: firebaseReturnData.inicialValor,
                    finalValor: firebaseReturnData.finalValor
                }
                paginas.push(pagina);
                this.setState({
                    paginas,
                    paginaActual : paginaActual - 1,
                    inmuebles : firebaseReturnData.arrayInmuebles
                })                
            })
        }
    }

    siguientePagina = () => {
        const {paginaActual, paginaSize, busquedaText, paginas} = this.state;
        const firebase = this.props.firebase;
        obtenerData(firebase, paginaSize, paginas[paginaActual].finalValor, busquedaText).then(firebaseReturnData => {
            if(firebaseReturnData.arrayInmuebles.length > 0){
                const pagina = {
                    inicialValor: firebaseReturnData.inicialValor,
                    finalValor: firebaseReturnData.finalValor                     
                }

                console.log(firebaseReturnData.arrayInmuebles)
                paginas.push(pagina);
                this.setState({
                    paginas,
                    paginaActual: paginaActual + 1,
                    inmuebles: firebaseReturnData.arrayInmuebles
                })                
            }
        })
    }

    //metodo se dispara en el momento en que se cargo el componente
    //es asincrono porque tiene que esperar la peticion y el resultado del server
    async componentDidMount() {
        const {paginaSize, busquedaText, casaInicial, paginas} = this.state;
        const firebase = this.props.firebase;
        const firebaseReturnData = await obtenerData(firebase, paginaSize, casaInicial, busquedaText);

        const pagina = {
            inicialValor: firebaseReturnData.inicialValor,
            finalValor: firebaseReturnData.finalValor
        }
        
        paginas.push(pagina);
        this.setState({
            inmuebles: firebaseReturnData.arrayInmuebles,
            paginas,
            paginaActual: 0
        })
    }

    render() {
        return (
            <Container style={style.cardGrid}>
                <Paper style={style.paper}>
                    <Grid item xs={12} md={12}>
                        <Breadcrumbs aria-label="breadcrumbs">
                            <Link color="inherit" style={style.link} href="/">
                                <HomeIcon />
                                Home
                            </Link>
                            <Typography color="textPrimary">Mis inmuebles</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item
                        xs={12} sm={6} style={style.gridTextfield}>
                        <TextField
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="busquedaText"
                            variant="outlined"
                            label="Ingrese el inmueble a buscar"
                            onChange={this.cambiarBusquedaTexto}
                            value={this.state.busquedaText}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} style={style.barraBoton} >
                        <Grid container spacing={1} direction="column" alignItems="flex-end">
                            <ButtonGroup size="small" aria-label="Small outlined group">
                                <Button onClick={this.anteriorPagina}>
                                    <ArrowLeft />
                                </Button>
                                <Button onClick={this.siguientePagina}>
                                    <ArrowRight />
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} style={style.gridTextfield}>
                        <Grid container spacing={4}>
                            {this.state.inmuebles.map(card => (
                                <Grid item key={card.id} xs={12} sm={6} md={4} >
                                    <Card style={style.card}>
                                        <CardMedia
                                            style={style.cardMedia}
                                            image={

                                                card.fotos ? card.fotos[0]
                                                    ? card.fotos[0]
                                                    : logo
                                                    : logo
                                            }
                                            title="Mi inmueble"
                                        />
                                        <CardContent style={style.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {card.ciudad + ", " + card.pais}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary" onClick={() => this.editarInmueble(card.id)}>
                                                Editar
                                            </Button>
                                            <Button size="small" color="primary" onClick={() => this.eliminarInmueble(card.id)}>
                                                Eliminar
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                </Paper>
            </Container>
        )
    }
}

export default consumerFirebase(ListaInmuebles);