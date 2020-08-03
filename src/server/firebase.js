import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBdxumaSsLfNCAbMwZaadL2tRqERTW2nk4",
    authDomain: "todo-1650d.firebaseapp.com",
    databaseURL: "https://todo-1650d.firebaseio.com",
    projectId: "todo-1650d",
    storageBucket: "todo-1650d.appspot.com",
    messagingSenderId: "124030064490",
    appId: "1:124030064490:web:aa89d6dbbd40f033bd7713"
  };

class Firebase{
    constructor(){
        app.initializeApp(firebaseConfig);
        this.db = app.firestore();
        this.auth = app.auth();
        this.storage = app.storage();

        this.storage.ref().constructor.prototype.guardarDocumentos = function(documentos){
            var ref=this;
            //funcion que envia un arreglo de fotos y devuelve sus urls
            return Promise.all(documentos.map(function(file){
                return ref.child(file.alias).put(file).then(snapshot => {
                    return ref.child(file.alias).getDownloadURL();
                })
            }))
        }
    } 
    
    isStarted(){
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve);
        })
    }

    guardarDocumento = (nombreDoc, documento) => this.storage.ref().child(nombreDoc).put(documento);
    devolverDocumento = (documentoUrl) => this.storage.ref().child(documentoUrl).getDownloadURL();
    guardarDocumentos = (documentos) => this.storage.ref().guardarDocumentos(documentos)
}

export default Firebase;