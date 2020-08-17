import axios from 'axios';

export const obtenerUsuariosApp = (dispatch) => {
    return new Promise( async (resolve,eject)=>{
        const dataRest = await axios.get();

        dispatch({
            type:"LISTA_USUARIOS",
            payload: dataRest.data
        });
        resolve();
    })
}

export const actualizarRoles = (dispatch,usuario) => {
    return new Promise(async (resolve,eject)=>{
        const dataRest = await axios.post(``,usuario);
        dispatch({
            type:"ACTUALIZAR_ROLES",
            payload: dataRest.data
        });
        resolve();
    })
}