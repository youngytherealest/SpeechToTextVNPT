import React, {useState, useEffect} from 'react';
import { Header, Button} from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import Message from '../components/Message';
import { speechToText } from '../apis/api';
import uploadImg from "../data/upload.jpg";

function Upload() {
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [progress, setProgress] = useState([]);
  const [uploadMessage, setUploadMessage] = useState([]);
  const { currentColor } = useStateContext();
  const userToken = localStorage.getItem("accessToken");

  function selectFile(event) {
    //setSelectedFiles(event.target.files);
    const file = event.target.files[0];
    setSelectedName(file.name);
    setSelectedFiles(event.target.files);
  }

  function upload() {
    let currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);

    let formData = new FormData();

    formData.append("file", currentFile);
    formData.append("max_duration", "20");
    
    var tmp = '';
    speechToText(formData, userToken)
      .then((response) => {
        for (let index = 0; index < response.data.length; index++) {
           tmp = tmp + response.data[index].text;
        }
        console.log(tmp);
          setMessages(messages => (
            [messages, tmp]
            ));
      })
      .then((files) => {
      })
      .catch(() => {
        setProgress(0);
        setUploadMessage("Không thể tải tệp lên!");
        setCurrentFile(undefined);
      });

    setSelectedFiles(undefined);
  }
  
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <Header title="Upload" />
    <div>
        {/* {currentFile && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )} */}
        <div className="app">
          <div className="parent">
            <div className="file-upload">
              <img src={uploadImg} alt="upload" />
              <h3><b>{selectedName || "Nhấn để tải tệp tin lên"}</b></h3>
              <p>mp3 và các tệp định dạng âm thanh khác <b style={{color:"orange"}}>các tệp tải lên không quá 2GB</b></p>
              <input type="file" onChange={(event) => selectFile(event)}/>
            </div>
          </div>
        </div>

        {/* <label style={{backgroundColor:"#EDF7F9"}}>
          <input type="file" onChange={(event) => selectFile(event)} />
        </label> */}

        <div onClick={upload} style={{padding:"10px", marginTop:"20px"}}>
          <Button
            color="white"
            bgColor={currentColor}
            text="Bắt đầu"
            disabled={!selectedFiles}
          />
        </div>
        <label style={{fontSize:"1.5rem", }}>
         <b>Kết quả gỡ băng</b>
        </label>
        <div className="alert alert-light" role="alert">
          {uploadMessage}
        </div>

        {/* <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                </li>
              ))}
          </ul>
        </div> */}
      </div>
    <br/>
    <div className="messages">
      {messages.map((m) => (
        <Message message={m}/>
      ))}
    </div>
  </div>
  )
}

export default Upload