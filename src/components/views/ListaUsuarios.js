import React, { useState, useEffect } from 'react';
import { Container, Paper, Grid, Table, TableBody } from '@material-ui/core'
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
    console.log(listaArreglo);
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

                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default ListaUsuarios;