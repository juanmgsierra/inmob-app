import React, { Component } from 'react';
import { Container, Paper, Breadcrumbs, Link, TextField, Typography, Grid, Button } from '@material-ui/core';
import { consumerFirebase } from '../../server';
import HomeIcon from '@material-ui/icons/Home'

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
    }
}
class EditarInmueble extends Component {
    render() {
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
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="ciudad"
                                label="Ciudad"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="pais"
                                label="Pais"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="descripcion"
                                label="Descripcion del inmueble"
                                fullWidth
                                multiline
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="interior"
                                label="Interior del inmueble"
                                fullWidth
                                multiline
                            />
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