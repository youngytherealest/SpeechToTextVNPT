import React, {useState, useEffect} from 'react';
import { Header, Button} from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import Message from '../components/Message';
import { speechToText, saveLogs } from '../apis/api';
import uploadImg from "../data/upload.jpg";
import { useNavigate, Link } from "react-router-dom";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

function Upload() {
  const [messages, setMessages] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);
  const [uploadMessage, setUploadMessage] = useState([]);
  const { currentColor } = useStateContext();
  const [textarea, setTextArea] = useState(''); // Khởi tạo state với giá trị rỗng
  const handleChange = (event) => {
    setTextArea(event.target.value);
  }
  const userToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  function selectFile(event) {
    //setSelectedFiles(event.target.files);
    const file = event.target.files[0];
    setSelectedName(file.name);
    setSelectedFiles(event.target.files);
  }
  function logoutHandle() {
    //logout(localStorage.getItem("accessToken"));
    navigate("/login");
    localStorage.clear();
    
  }

  function upload() {
    if (!selectedFiles.length) return;
    if (selectedFiles.length > 1) {
      toastr.error('Cho phép gỡ băng 1 file');
      return;
    }
    let currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);
    setUploading(true);
    let formData = new FormData();

    formData.append("file", currentFile);
    formData.append("max_duration", "20");
    var tmp = '';
    speechToText(formData, userToken)
      .then((response) => {
        if(response.detail){
           logoutHandle();
        }else{  
          saveLogs(response, userToken).then(
            res => {
              //setAudioData(response.data);
            }
          )
          for (let index = 0; index < response.data.length; index++) {
            tmp = tmp + response.data[index].text;
         }
           setMessages(tmp);
        }
        
      })
      .then((files) => {
      })
      .catch(() => {
        setUploading(false);
        setProgress(0);
        toastr.error('Có lỗi xảy ra!!')
        setCurrentFile(undefined);
      })
      .finally(() => {
        if(tmp != ''){
          setUploading(false); // Kết thúc quá trình tải lên
          toastr.success('Gỡ băng thành công!')
          setCurrentFile(undefined);
        }  
      });

    setSelectedFiles(undefined);
  }
  
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <Header title="Gỡ băng file âm thanh" />
    <div>
        
        <div className="app">
          <div className="parent">
            <div className="file-upload">
              <img src={uploadImg} alt="upload" />
              <h3><b>{selectedName || "Nhấn để tải tệp tin lên"}</b></h3>
              <p>.wav file <b style={{color:"orange"}}> và tệp tải lên không quá 2GB</b></p>
              <input type="file" onChange={(event) => selectFile(event)}/>
            </div>
          </div>
        </div>

        <div onClick={upload} style={{padding:"10px", marginTop:"20px", width:"100%"}}>
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
        {uploading && (
          <Box sx={{ width: '100%', height: '10%' }}>
            <LinearProgress color="success"  
            sx={{ height: '20px' }} 
            />
          </Box>
        )}
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
    <div className='messages'>
      <textarea
        disabled="disabled"
        value={messages}        // Giá trị hiện tại của textarea
        onChange={handleChange} // Xử lý khi nội dung thay đổi
        rows="13"           // Số hàng hiển thị
        cols="130"           // Số cột hiển thị
        placeholder="Kết quả sau gỡ băng..." // Văn bản hiển thị khi textarea rỗng
        color='white'
      />
    </div>
  </div>
  )
}

export default Upload