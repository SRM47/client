import { React, useEffect, useState } from 'react';
import { useLoaderData, useNavigate, redirect } from "react-router-dom";
import { socket } from '../socket';


const Roomcode = ({ roomId }) => {
       return (
              <div>
                     Room Code: {roomId}
              </div>
       );

};

const Activeplayers = ({ numPlayers }) => {
       return (
              <div>
                     <p>{numPlayers}</p>
              </div>
       );
};



const Leaveroom = ({ roomId }) => {
       const navigate = useNavigate();
       function leaveRoom(){
              socket.emit("leave_room", {roomId: roomId, playerId: localStorage.getItem("activePlayerId")}, (response) => {
                     // remove the playerid and active roomid only when the entire leave room function is done
                     console.log(response.status);
                     localStorage.removeItem("activeRoomId");
                     localStorage.removeItem("activePlayerId");
                     navigate("/", {replace:true});
              });
              
       }
       return (
              <div>
                     <button onClick={leaveRoom}>Leave Room</button>
              </div>  
       );
};

function Sidebar({roomId, numPlayers}){


       return (
              <div>
                     <Roomcode roomId={roomId}/>
                     <Activeplayers numPlayers={numPlayers}/>
                     <Leaveroom roomId={roomId}/>
              </div>
       );
};

export default Sidebar;

