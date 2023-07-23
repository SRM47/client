import {React, useEffect, useState} from 'react';
import { useRoutes, Route, useNavigate, redirect } from "react-router-dom";
import { socket } from '../socket';

const ROOM_CODE_VALIDATION = /^[A-Za-z0-9]{7}$/;

function Root() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(null);
  const [validRoomCode, setValidRoomCode] = useState(false);

  function handleRoomCodeInput(code){
    setRoomId(code);
    setValidRoomCode(ROOM_CODE_VALIDATION.test(code));
  }

  function joinRoom() {
    if(roomId == null || !validRoomCode){
      alert("Invalid Room Code");
      return;
    } 
    // join room logic is in room.js. By navigating to a valid /play/roomid link, you join a room
    console.log(roomId);
    navigate(`/play/${roomId}`, {replace: true}); // navigate to the play site
  };

  return (
    <>
      <h2>
        dot dot dot...
      </h2>
      <label > Enter Room Code </label>
      <input onChange={(e) => handleRoomCodeInput(e.target.value)}></input>
      <button onClick={joinRoom}>Join Room!</button> <br></br>
      <i>If the room doesn't exist, we'll make one for you</i>
      <p>Valid room code: {`${validRoomCode}`}</p>
    </>
  );
}

export default Root;
