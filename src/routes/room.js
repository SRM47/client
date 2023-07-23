import { React, useEffect, useState } from 'react';
import { useLoaderData, useNavigate, redirect, useParams } from "react-router-dom";
import { socket } from '../socket';
import Sidebar from '../components/sidebar';
import QuestionBar from '../components/questions';
import Response from '../components/response';
import { v4 as uuidv4 } from 'uuid';

const ROOM_CODE_VALIDATION = /^[A-Za-z0-9]{7}$/;


const is_valid_room_id = (roomId) => {
       if (roomId == undefined) return false;
       return ROOM_CODE_VALIDATION.test(roomId);
};



function Room() {
       const navigate = useNavigate();
       const [roomId, setRoomId] = useState(null);
       const [numPlayers, setNumPlayers] = useState(0);
       const [playerId, setPlayerId] = useState(localStorage.getItem("activePlayerId"));

       let params = useParams();

       useEffect(() => {

              function roomIdsWrapper(room){
                     setRoomId(room);
              }

              function playerIdWrapper(player) {
                     setPlayerId(player);
              }

              const roomId_from_url = params.roomId;
              // check if a room id was provided. The param is optional in the link
              // if the room id is invalid, or not provided, redirect to the main page
              if (is_valid_room_id(roomId_from_url)) {
                     if (!localStorage.getItem("activePlayerId")){
                            localStorage.setItem("activePlayerId", uuidv4()); 
                            playerIdWrapper(localStorage.getItem("activePlayerId"));
                     }
                     console.log(localStorage.getItem("activePlayerId"));
                     localStorage.setItem("activeRoomId", JSON.stringify(roomId_from_url));
                     socket.emit('join_room', {"roomId":roomId_from_url, "playerId":localStorage.getItem("activePlayerId")});
                     roomIdsWrapper(roomId_from_url);
              } else {
                     alert("Invalid room code!");
                     navigate("/", {replace:true});
              }

       }, []);

       useEffect(() => {
              // update the number of players in the room
              const updatePlayers = (res) => setNumPlayers(res.numPlayers);
              socket.on('num_players', updatePlayers);
              // to avoid updating multiple times
              return () => {
                     socket.off('num_players', updatePlayers);  
              }
       }, [socket, numPlayers]);

       useEffect(() => {
              // update the number of players in the room
              const isSocketAllowedInRoom = (res) => {
                     console.log("im here here here!");
                     if (res.playerId == localStorage.getItem("activePlayerId")){
                            alert("You've left the room");
                            navigate("/", {replace:true});
                     }
              };
              socket.on("other_sockets_leave_room", isSocketAllowedInRoom);
              // to avoid updating multiple times
              return () => {
                     socket.on("other_sockets_leave_room", isSocketAllowedInRoom);
              }
       }, [socket]);

       


       return (
              <>
                     <div>
                            
                            <Sidebar roomId={roomId} numPlayers={numPlayers}/>
                            <QuestionBar roomId={roomId} playerId={playerId}/>
                            <Response roomId={roomId} playerId={playerId}/>

                     </div>
              </>
       );

}

export default Room;

