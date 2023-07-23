import { React, useEffect, useState } from 'react';
import { useLoaderData, useNavigate, redirect } from "react-router-dom";
import { socket } from '../socket';
import { v4 as uuidv4 } from 'uuid';

const QuestionItem = ({ question, roomId, isUserQuestion, questionId }) => {

       function deleteQuestion(){
              socket.emit('remove_question', {
                     "questionId": questionId,
                     "roomId": roomId,
                     "playerId": localStorage.getItem("activePlayerId"),
              });
       }

       return (
              <div>
                     <p>{question}</p>
                     {isUserQuestion ? <button onClick={deleteQuestion}>Delete Question</button> : <></>}
              </div>
       );
};

const QuestionArea = ({ questions, roomId , userQuestions}) => {
       const player_id = localStorage.getItem("activePlayerId");

       return (
              <div>
                     {questions.map((e) => <QuestionItem question={e.question} roomId={roomId} isUserQuestion={player_id==e.playerId} questionId={e.questionId}/>)}
              </div>
       );
};

const CurrentQuestion = ({ question }) => {

};

function QuestionBar({ roomId, playerId }){
       const [questions, setQuestions] = useState([]);
       const [currentQuestion, setCurrentQuestion] = useState("");
       // on initial join, messages should update
       useEffect(() => {
              socket.on('setAllQuestions', (data) => setQuestions(data.questions));
              return (() => {
                     socket.off('setAllQuestions', (data) => setQuestions(data.questions));
              });
       }, []);

       // functionality for messaging
       useEffect(() => {
              socket.on('messageQuestion', (data) => setQuestions([...questions, data]));
              return (()=>{
                     socket.off("messageQuestion");
              });
       }, [socket, questions]);


       function sendResponse(e){
              console.log(playerId);
              e.preventDefault();
              socket.emit('message_question', {
                     "question": currentQuestion,
                     "roomId": roomId,
                     "playerId": playerId,
                     "questionId": uuidv4()
              });
       };

       return (
              <div>
          
                     <QuestionArea questions={questions} roomId={roomId}/>
                     <div>
                            <label>Type Question:</label>
                            <input type="text" onChange={(e) => setCurrentQuestion(e.target.value)}></input>
                            <button onClick={sendResponse}>Send</button>
                            
                     </div>
                     
              </div>
       );

};

export default QuestionBar;

