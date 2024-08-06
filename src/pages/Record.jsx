import React, {useState} from 'react';
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { Header } from '../components';
import axios from 'axios';
import AudioRecorder from './AudioRecorder';
import { useStateContext } from '../contexts/ContextProvider';
import Message from '../components/Message';
import toastr from 'toastr';
import { useNavigate } from "react-router-dom";

function Record() {
  
  const { currentColor, currentMode } = useStateContext();
  const [messages, setMessages] = useState("");
  const userToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <Header title="Ghi âm theo thời gian thực" />
    <div>
    <AudioRecorder currentColor={currentColor} setMessages={setMessages} messages={messages} userToken={userToken} navigate={navigate}/>
    </div> 
    <div className='messages'>
      <textarea
        disabled="disabled"
        value={messages}        // Giá trị hiện tại của textarea
        rows="13"           // Số hàng hiển thị
        cols="130"           // Số cột hiển thị
        placeholder="Kết quả sau gỡ băng..." // Văn bản hiển thị khi textarea rỗng
        color='white'
      />
    </div>
  </div>
  )
}

export default Record