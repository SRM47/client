import { React, useEffect, useState } from 'react';
import { useLoaderData, useNavigate, redirect } from "react-router-dom";
import { socket } from '../socket';
import { v4 as uuidv4 } from 'uuid';


const ResponseItem = ({ response, isUserResponse}) => {

       const mystyle = {
              color: isUserResponse ? "red" : "black",
       };

       return (
              <div>
                     <p style={mystyle}>{response}</p>
              </div>
       );
};

const ResponseArea = ({ responses }) => {
       const player_id = localStorage.getItem("activePlayerId");
       return (
              <div>
                     {responses.map((e) => <ResponseItem response={e.response} isUserResponse={player_id==e.playerId}/>)}
              </div>
       );
};

function Response({ roomId, playerId }){
       const [responses, setResponses] = useState([]);
       const [currentMessage, setCurrentMessage] = useState("");

       // on initial join, messages should update
       useEffect(() => {
              socket.on('initialMessages', (data) => setResponses(data.messages));
              return (() => {
                     socket.off('initialMessages', (data) => setResponses(data.messages));
              });
       }, []);

       // functionality for messaging
       useEffect(() => {
              socket.on('messageResponse', (data) => setResponses([...responses, data]));
              return (()=>{
                     socket.off("messageResponse");
              });
       }, [socket, responses]);


       function sendResponse(e){
              e.preventDefault();
              console.log("here");
              socket.emit('message', {
                     "message": currentMessage,
                     "roomId": roomId,
                     "playerId": playerId,
              });
       };

       return (
              <div>
                     <ResponseArea responses={responses}/>
                     <div>
                            <label>Type Respose:</label>
                            <input type="text" onChange={(e) => setCurrentMessage(e.target.value)}></input>
                            <button onClick={sendResponse}>Send</button>
                            
                     </div>
                     
              </div>
       );
}

export default Response;

