import axios from 'axios';

export const obtenerUsuariosApp = (dispatch) => {
    return new Promise( async (resolve,eject)=>{
        const dataRest = await axios.get('https://us-central1-todo-1650d.cloudfunctions.net/users/allUsers');
        dispatch({
            type:"LISTA_USUARIOS",
            payload: dataRest.data
        });
        resolve();
    })
}

export const actualizarRoles = (dispatch,usuario) => {
    return new Promise(async (resolve,eject)=>{
        const dataRest = await axios.post(`https://us-central1-todo-1650d.cloudfunctions.net/users/roles`,usuario);
        dispatch({
            type:"ACTUALIZAR_ROLES",
            payload: dataRest.data
        });
        resolve();
    })
}