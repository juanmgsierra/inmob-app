import React, { useState, useEffect } from 'react';
import { Container, Paper, Grid, Table, TableBody, TableRow, TableCell, Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux';
import { obtenerUsuariosApp } from '../../redux/actions/usuarioAction';

const style = {
    paper: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5"
    },
    container: {
        paddingTop: "8px"
    }
}

const ListaUsuarios = props => {
    const [isLoading, setLoading] = useState(false);

    const listaArreglo = useSelector(state => state.usuarioRedux.usuarios);
    const dispatch = useDispatch();

    useEffect(()=>{
        /*if(!isLoading){
            obtenerUsuariosApp(dispatch).then(success =>{
                setLoading(true)
            })
        }*/
        async function obtenerData(){
            await obtenerUsuariosApp(dispatch)
        }

        if(!isLoading){
            setLoading(true);
            obtenerData();
        }
    })

    return (
        <Container style={style.container}>
            <Paper style={style.paper}>
                <Grid container justify="center">
                    <Grid item xs={12} sm={12}>
                        <Table>
                            <TableBody>
                                {
                                    listaArreglo ? listaArreglo.map((row,id) => (
                                       <TableRow key={id}>
                                            <TableCell align="left">{row.email || row.telefono}</TableCell>
                                            <TableCell align="left">{row.nombre ? (row.nombre + ' ' + row.apellido) : ""}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" size="small">Roles</Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" size="small">Enviar mensaje</Button>
                                            </TableCell>
                                        </TableRow> 
                                    )
                                    ) : ""
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default ListaUsuarios;