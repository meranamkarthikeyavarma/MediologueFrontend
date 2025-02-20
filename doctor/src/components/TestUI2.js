


// import React, { useState } from 'react';
// import './TestUI2.css';

// const TestUI2 = () => {
//   const [conversationActive, setConversationActive] = useState(false);
//   const [heading, setHeading] = useState('Mediologue');
//   const [text, setText] = useState('Leveraging the Power of AI we are making the Best Models');

//   const startConversation = () => {
//     setConversationActive(true);
//     setHeading('Conversation');
//     setText('Recording conversation...');
//   };

//   const stopConversation = async () => {
//     setConversationActive(false);
//     setText('Processing conversation...');

//     try {
//       const formData = new FormData();
//       const audioFile = new File([""], "recording.wav", { type: "audio/wav" }); // Placeholder file
//       formData.append("audio", audioFile);

//       const response = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       setText(`Extracted Data: ${data.structured_data}`);
//     } catch (error) {
//       console.error("Error uploading audio:", error);
//       setText("Error processing conversation.");
//     }
//   };

//   return (
//     <div className="container">
//       <header className="header">
//         <h1>INHS Kalyani Super Speciality Hospital</h1>
//         <h3>M7P2+P2V, Malkapuram, Gandhigram Post, Nausena Baugh, Visakhapatnam, Andhra Pradesh 530005</h3>
//       </header>

//       <div className="Services">
//         <div className="service-card">
//           <h2>{heading}</h2>
//           <p>{text}</p>
//           {conversationActive ? (
//             <button className="stop-button" onClick={stopConversation}>Stop</button>
//           ) : (
//             <button className="start-button" onClick={startConversation}>Start</button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestUI2;
// import React, { useState } from 'react';
// import './TestUI2.css';

// const TestUI2 = () => {
//   const [conversationActive, setConversationActive] = useState(false);
//   const [heading, setHeading] = useState('Mediologue');
//   const [text, setText] = useState('Leveraging the Power of AI we are making the Best Models');
//   const [structuredData, setStructuredData] = useState(null);

//   const startConversation = () => {
//     setConversationActive(true);
//     setHeading('Conversation');
//     setText('Recording conversation...');
//   };

//   const stopConversation = async () => {
//     setConversationActive(false);
//     setText('Processing conversation...');

//     try {
//       const formData = new FormData();
//       const audioFile = new File([""], "recording.wav", { type: "audio/wav" }); // Placeholder file
//       formData.append("audio", audioFile);

//       const response = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       setStructuredData(data.structured_data);
//       setText('Extracted Data:');
//     } catch (error) {
//       console.error("Error uploading audio:", error);
//       setText("Error processing conversation.");
//     }
//   };

//   const renderStructuredData = () => {
//     if (!structuredData) return null;

//     // Convert the object into a list of key-value pairs
//     return Object.entries(structuredData).map(([key, value]) => (
//       <div key={key}>
//         <strong>{key}:</strong> {value}
//       </div>
//     ));
//   };

//   return (
//     <div className="container">
//       <header className="header">
//         <h1>INHS Kalyani Super Speciality Hospital</h1>
//         <h3>M7P2+P2V, Malkapuram, Gandhigram Post, Nausena Baugh, Visakhapatnam, Andhra Pradesh 530005</h3>
//       </header>

//       <div className="Services">
//         <div className="service-card">
//           <h2>{heading}</h2>
//           <p>{text}</p>

//           {conversationActive ? (
//             <button className="stop-button" onClick={stopConversation}>Stop</button>
//           ) : (
//             <button className="start-button" onClick={startConversation}>Start</button>
//           )}

//           {/* Render the structured data */}
//           <div className="structured-data">
//             {renderStructuredData()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestUI2;



import React, { useState, useRef } from 'react';
import './TestUI2.css';

const TestUI2 = () => {
  const [conversationActive, setConversationActive] = useState(false);
  const [heading, setHeading] = useState('Mediologue');
  const [text, setText] = useState('Leveraging the Power of AI we are making the Best Models');
  const [structuredData, setStructuredData] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startConversation = async () => {
    setConversationActive(true);
    setHeading('Conversation');
    setText('Recording conversation...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setText('Error accessing microphone. Please check your settings.');
      setConversationActive(false);
    }
  };

  const stopConversation = async () => {
    setConversationActive(false);
    setText('Processing conversation...');

    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      try {
        const response = await fetch('https://mediologuebackend.onrender.com/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setStructuredData(data.structured_data);
        setText('Extracted Data:');
      } catch (error) {
        console.error('Error uploading audio:', error);
        setText('Error processing conversation.');
      }
    };
  };

  const renderStructuredData = () => {
    if (!structuredData) return null;
    return Object.entries(structuredData).map(([key, value]) => (
      <div key={key}>
        <strong>{key}:</strong> {value}
      </div>
    ));
  };

  return (
    <div className="container">
      <header className="header">
        <h1>INHS Kalyani Super Speciality Hospital</h1>
        <h3>M7P2+P2V, Malkapuram, Gandhigram Post, Nausena Baugh, Visakhapatnam, Andhra Pradesh 530005</h3>
      </header>

      <div className="Services">
        <div className="service-card">
          <h2>{heading}</h2>
          <p>{text}</p>

          {conversationActive ? (
            <button className="stop-button" onClick={stopConversation}>Stop</button>
          ) : (
            <button className="start-button" onClick={startConversation}>Start</button>
          )}

          <div className="structured-data">
            {renderStructuredData()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUI2;
