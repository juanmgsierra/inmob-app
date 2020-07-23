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
    } 
    
    isStarted(){
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve);
        })
    }

    guardarDocumento = (nombreDoc, documento) => this.storage.ref().child(nombreDoc).put(documento);
    devolverDocumento = (documentoUrl) => this.storage.ref().child(documentoUrl).getDownloadURL();
}

export default Firebase;