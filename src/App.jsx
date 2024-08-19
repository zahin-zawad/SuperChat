import React, { useState } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthstate } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDtex_TaWRhRI5M_43YFxGlxYT6n4UbLt4",
  authDomain: "super-chat-9bdd1.firebaseapp.com",
  projectId: "super-chat-9bdd1",
  storageBucket: "super-chat-9bdd1.appspot.com",
  messagingSenderId: "864199720527",
  appId: "1:864199720527:web:c63882e94d8db7c93e743a",
  measurementId: "G-T4QTRC1KGY",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const [user] = useAuthstate(auth);

export default function App() {
  return <>
    <header>

    </header>

    <section>
      {user ? <ChatRoom/> : <SignIn/>}
    </section>
  </>;
}

function SignIn(){

  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign In with Google</button>

  )
}

function SignOut(){

  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const messagesRef = firestore.collection('messages');

  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    });

    setFormValue('');
  }

  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key= {msg.id} message={msg} />)}
    </div>

    <form onSubmit={sendMessage}>

      <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
      <button type="submit">🕊️</button>
    </form>
    
    </>


  )
}

function ChatMessage(props){

  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="DP" />
      <p>{text}</p>
    </div>
  )
  
  
}