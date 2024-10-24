import React, { useState, useEffect, useRef } from 'react';
import { useChat } from "./hooks/useChat";
import "./Ui.css"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const UI = ({ hidden, ...props }) => {
  const navigate = useNavigate();
    const [isChat, setIsChat] = React.useState(true);

    const handleToggleClick = () => {
        if (isChat) {
            navigate('/quizm');
        } else {
            navigate('/male');
        }
        setIsChat(!isChat);
    };
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  //SpeechToText
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);
  useEffect(() => {
    // Initialize the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimText += transcriptPiece;
          }
        }
        setTranscript((prev) => prev + finalTranscript);
        setInterimTranscript(interimText);
      };
    } else {
      alert('Speech Recognition API is not supported in this browser.');
    }
  }, []);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleReset = () => {
    setTranscript('');
    setInterimTranscript('');
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscriptChange = (event) => {
    setTranscript(event.target.value);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>VLearn</h1>
        </div>
        <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button onClick={handleToggleClick}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
          >
            {isChat ? 'Quiz' : 'Chat'}
          </button>
        </div>
        <div className="chatUi">
          <input
            className="w-full placeholder:text-gray-800 p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            placeholder="Type a message..."
            type="text"
            ref = {input}
            value={transcript + interimTranscript}
            onChange={handleTranscriptChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          {/* <div>
            <div
              contentEditable
              onInput={handleTranscriptChange}
              placeholder="Type a message..."
              className="w-full placeholder:text-gray-800 p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
              ref={transcriptRef}
            />
          </div> */}

          <button
            onClick={handleToggleRecording}
            style={{ fontFamily: 'Poppins, sans-serif' }}
            className={`bg-blue-500 hover:bg-blue-600 text-white p-4 font-semibold uppercase rounded-full "cursor-not-allowed opacity-30" : ""}`}
          >
            {isRecording ?
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.7812 18.75L5.03125 3" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M19.2812 11.25V9.77111C19.2812 9.36752 18.9709 9.02111 18.5673 9.00096C18.4659 8.99607 18.3646 9.01182 18.2695 9.04726C18.1743 9.0827 18.0874 9.13709 18.0139 9.20712C17.9404 9.27716 17.8818 9.36139 17.8419 9.45471C17.8019 9.54803 17.7813 9.64849 17.7812 9.75002V11.25C17.7815 11.6344 17.7393 12.0177 17.6556 12.3928C17.6522 12.4081 17.6527 12.4241 17.6571 12.4391C17.6614 12.4542 17.6694 12.4679 17.6805 12.4791L18.7394 13.538C18.7505 13.5491 18.7642 13.5573 18.7793 13.5617C18.7944 13.5661 18.8104 13.5666 18.8257 13.5633C18.8411 13.5599 18.8553 13.5528 18.8672 13.5424C18.8791 13.5321 18.8881 13.519 18.8936 13.5042C19.1507 12.7805 19.2819 12.0181 19.2812 11.25ZM12.5312 16.5C11.1402 16.4956 9.80746 15.941 8.82385 14.9574C7.84025 13.9738 7.2857 12.641 7.28125 11.25V9.77111C7.28125 9.36752 6.97094 9.02111 6.56734 9.00096C6.46594 8.99607 6.36459 9.01182 6.26945 9.04726C6.17432 9.0827 6.08736 9.13709 6.01386 9.20712C5.94036 9.27716 5.88185 9.36139 5.84187 9.45471C5.80188 9.54803 5.78126 9.64849 5.78125 9.75002V11.25C5.78125 14.7188 8.41094 17.5838 11.7812 17.9583V20.25H9.55234C9.14875 20.25 8.80234 20.5603 8.78219 20.9639C8.7773 21.0653 8.79306 21.1667 8.82849 21.2618C8.86393 21.357 8.91832 21.4439 8.98835 21.5174C9.05839 21.5909 9.14262 21.6494 9.23594 21.6894C9.32926 21.7294 9.42973 21.75 9.53125 21.75H15.5102C15.9137 21.75 16.2602 21.4397 16.2803 21.0361C16.2852 20.9347 16.2694 20.8334 16.234 20.7382C16.1986 20.6431 16.1442 20.5561 16.0741 20.4826C16.0041 20.4091 15.9199 20.3506 15.8266 20.3106C15.7332 20.2707 15.6328 20.25 15.5312 20.25H13.2812V17.9583C14.1349 17.8633 14.9624 17.6052 15.7188 17.198C15.7444 17.184 15.7665 17.1643 15.7831 17.1403C15.7998 17.1163 15.8106 17.0888 15.8148 17.0599C15.8189 17.031 15.8163 17.0015 15.807 16.9738C15.7977 16.9461 15.7821 16.9209 15.7614 16.9003L14.8989 16.0383C14.8783 16.0178 14.8519 16.0042 14.8233 15.9994C14.7947 15.9945 14.7653 15.9986 14.7391 16.0111C14.0479 16.334 13.2941 16.5009 12.5312 16.5ZM12.5847 2.25002C11.9479 2.23833 11.3188 2.3897 10.757 2.68974C10.1952 2.98978 9.71955 3.42852 9.37516 3.96424C9.35193 4.0003 9.34177 4.04325 9.34637 4.0859C9.35098 4.12855 9.37007 4.16834 9.40047 4.19861L16.1214 10.9219C16.1345 10.935 16.1513 10.9438 16.1694 10.9474C16.1876 10.951 16.2064 10.9491 16.2235 10.942C16.2406 10.9348 16.2552 10.9228 16.2655 10.9074C16.2758 10.892 16.2813 10.8739 16.2812 10.8553V6.04268C16.2812 3.98439 14.6406 2.27814 12.5847 2.25002Z" fill="white"/>
              <path d="M8.94109 10.0781C8.92796 10.065 8.91124 10.0562 8.89307 10.0526C8.87489 10.049 8.85606 10.0509 8.83896 10.058C8.82186 10.0652 8.80725 10.0772 8.79698 10.0926C8.78671 10.108 8.78124 10.1261 8.78125 10.1447V11.2031C8.78198 12.2023 9.177 13.1608 9.88047 13.8703C10.3418 14.35 10.9246 14.6957 11.5667 14.8706C12.2089 15.0455 12.8865 15.0431 13.5273 14.8636C13.5431 14.8591 13.5575 14.8506 13.569 14.8388C13.5804 14.8271 13.5886 14.8126 13.5927 14.7967C13.5968 14.7808 13.5966 14.7641 13.5922 14.7483C13.5878 14.7324 13.5794 14.7181 13.5677 14.7065L8.94109 10.0781Z" fill="white"/>
              </svg>
              :
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H15M18 9.75V11.25C18 14.55 15.3 17.25 12 17.25M12 17.25C8.7 17.25 6 14.55 6 11.25V9.75M12 17.25V21" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" />
                <path d="M12 15C11.505 14.9988 11.0153 14.8982 10.56 14.7042C10.1046 14.5101 9.6929 14.2265 9.34925 13.8703C8.64578 13.1607 8.25076 12.2022 8.25003 11.2031V5.99997C8.24811 5.50697 8.34379 5.01847 8.53157 4.56263C8.71934 4.1068 8.99549 3.69264 9.34409 3.34403C9.6927 2.99543 10.1069 2.71928 10.5627 2.53151C11.0185 2.34373 11.507 2.24805 12 2.24997C14.1028 2.24997 15.75 3.89715 15.75 5.99997V11.2031C15.75 13.2965 14.0677 15 12 15Z" fill="white" />
              </svg>
              }
          </button>
          <button
            onClick={handleReset}
            className={`bg-blue-500 hover:bg-blue-600 text-white p-4 font-semibold uppercase rounded-full "cursor-not-allowed opacity-30" : ""}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2V4C10.1188 4.00015 8.29775 4.66326 6.85692 5.87283C5.41608 7.0824 4.4476 8.76104 4.12164 10.6138C3.79567 12.4666 4.13307 14.375 5.07456 16.0037C6.01605 17.6324 7.5014 18.8772 9.26962 19.5194C11.0378 20.1616 12.9758 20.1601 14.7431 19.5152C16.5103 18.8703 17.9938 17.6233 18.9328 15.9931C19.8718 14.363 20.2063 12.4541 19.8775 10.6018C19.5487 8.74954 18.5777 7.07237 17.135 5.865L15 8V2H21L18.553 4.447C19.636 5.38479 20.5044 6.54475 21.0992 7.84804C21.694 9.15133 22.0012 10.5674 22 12Z" fill="white" />
            </svg>

          </button>
          {/* <div>
            <h2>Transcript:</h2>
            <div
              contentEditable
              onInput={handleTranscriptChange}
              className="transcript"
              ref={transcriptRef}
            />
          </div> */}
          <button
            disabled={loading || message}
            onClick={sendMessage}
            style={{ fontFamily: 'Poppins, sans-serif' }}
            className={`bg-blue-500 hover:bg-blue-600 text-white p-4 font-semibold uppercase rounded-full ${loading || message ? "cursor-not-allowed opacity-30" : ""
              }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.4 20.4L20.85 12.92C21.0304 12.8432 21.1842 12.715 21.2923 12.5514C21.4004 12.3879 21.4581 12.1961 21.4581 12C21.4581 11.804 21.4004 11.6122 21.2923 11.4486C21.1842 11.2851 21.0304 11.1569 20.85 11.08L3.4 3.60003C3.2489 3.53412 3.08377 3.50687 2.91951 3.52073C2.75525 3.53459 2.59702 3.58912 2.4591 3.67942C2.32118 3.76971 2.20791 3.89292 2.1295 4.03793C2.0511 4.18293 2.01003 4.34518 2.01 4.51003L2 9.12003C2 9.62003 2.37 10.05 2.87 10.11L17 12L2.87 13.88C2.37 13.95 2 14.38 2 14.88L2.01 19.49C2.01 20.2 2.74 20.69 3.4 20.4Z" fill="white" />
            </svg>

          </button>
        </div>
      </div>
    </>
  );
}

export default UI;