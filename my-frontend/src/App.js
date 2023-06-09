import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import ChatScreen from './components/ChatScreen';
import Lobby from './components/Lobby';
import Verify from "./components/Verify";
import { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  const [sessionID, setSessionID] = useState("");
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleSessionChange = () => {
    setSessionID(localStorage.getItem('sessionID'));
  };
  
  //Check if user currently have a session or not, if yes go straight to the lobby screen
  //If user does not have a session, make them sign in.
  useEffect( () => {
    axios.get("http://localhost:3001/api/auth/session", { withCredentials: true })
      .then(res => {
          //console.log(res);
        if (res.data.loggedIn === true) {
          setSessionID(res.data.user);
        } else {
          setSessionID(null);
        }
        setLoading(false);  // Set loading to false after getting the response
      })
      .catch(err => {
        console.error(err);
        setLoading(false);  // Set loading to false even if there's an error
      });
  }, []);

  // While loading is true, show a loading message or spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      { sessionID 
          ? activeRoom 
            ? <ChatScreen room={activeRoom} onLeaveRoom={() => setActiveRoom(null) } user={sessionID}/> 
            : <Lobby onJoinRoom={setActiveRoom} setSessionID={setSessionID} user={sessionID}/> 
            : <LoginForm onSessionChange={handleSessionChange} setSessionID={setSessionID} />
      }
    </div>
  );
}

export default App;