import app from 'firebase/app';
import 'firebase/firestore';

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
    }    
}

export default Firebase;