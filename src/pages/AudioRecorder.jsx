import React, { Component } from "react";
import AudioAnalyser from "react-audio-analyser";
import axios from "axios";
import { Button } from "../components";
import { saveLogs, speechToText } from "../apis/api";


export default class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      audioQueue: [], // Queue để lưu các Blob
      processing: false,
    };
  }
  controlAudio(status) {
    this.setState({
      status
    });
  }
  changeScheme(e) {
    this.setState({
      audioType: e.target.value
    });
  }
  componentDidMount() {
    // Tạo kết nối WebSocket khi component được mount
    const ws = new WebSocket('ws://localhost:3000'); // Thay đổi URL nếu cần

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log(response);
      // Xử lý dữ liệu từ server
      const tmp = response.data.map(item => item.text).join('');
      this.props.setMessages(tmp);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.setState({ ws });
  }

  componentWillUnmount() {
    if (this.state.ws) {
      this.state.ws.close(); // Đóng kết nối WebSocket khi component bị unmount
    }
  }
  componentDidMount() {
    this.setState({
      audioType: "audio/wav"
    });
  }
  logoutHandle() {
    //logout(localStorage.getItem("accessToken"));
    this.props.navigate("/login");
    localStorage.clear();
    
  }
  render() {
    const { status, audioSrc, audioType } = this.state;
    const userToken = localStorage.getItem("accessToken");
    const audioProps = {
      audioType,
      // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
      status,
      audioSrc,
      timeslice: 5000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
      startCallback: e => {
        console.log("succ start", e)
      },
      pauseCallback: e => {
      },
      stopCallback: e => {
        // this.setState({
        //   audioSrc: window.URL.createObjectURL(e)
        // });
        // let name = String(Math.floor(Math.random() * 100) + 1) + '.wav'
        // var wavefilefromblob = new File([e], name);
        // var formData = new FormData();
        // formData.append("file", wavefilefromblob);
        // formData.append("max_duration", "5");
        // var tmp = '';
        // speechToText(formData, userToken)
        // .then((response) => {
        //     if(response.detail){
        //       this.logoutHandle();
        //     }else{  
        //       // saveLogs(response, userToken).then(
        //       //   res => {
        //       //     //setAudioData(response.data);
        //       //   }
        //       // )
        //       for (let index = 0; index < response.data.length; index++) {
        //         tmp = tmp + response.data[index].text;
        //      }
        //       this.props.setMessages(tmp);
        //     } 
        //   }
        // )

      },
      onRecordCallback: async e => {
        console.log(e);
        this.setState({
          audioSrc: window.URL.createObjectURL(e)
        });
        let name = String(Math.floor(Math.random() * 100) + 1) + '.wav'
        var wavefilefromblob = new File([e], name);
        var formData = new FormData();
        formData.append("file", wavefilefromblob);
        formData.append("max_duration", "10");
        speechToText(formData, userToken)
        .then((response) => {
            if(response.detail){
              this.logoutHandle();
            }else{  
              // saveLogs(response, userToken).then(
              //   res => {
              //     //setAudioData(response.data);
              //   }
              // )
              if (response.data && Array.isArray(response.data)) {
                let tmp = '';
                for (let index = 0; index < response.data.length; index++) {
                  tmp = tmp + response.data[index].text;
                }
                this.props.setMessages(tmp);
              } else {
                console.error("Invalid response data format:", response.data);
              }
            } 
          }
        )
        
      },
      errorCallback: err => {

      },
      backgroundColor: "#000000",
      width: 1200,
      strokeColor: "#ffff00",
      
    };
    return (
      <div>
        <div>
        <AudioAnalyser {...audioProps} >
          <div className="btn-box">
            <div onClick={() => this.controlAudio("recording")}>
              <Button
                color="white"
                bgColor={this.props.currentColor}
                text="Bắt đầu"
                borderRadius="10px"
              />
            </div>
            <div onClick={() => this.controlAudio("paused")}>
              <Button
                  color="white"
                  bgColor={this.props.currentColor}
                  text="Tạm dừng"
                  borderRadius="10px"
                />
            </div>
            <div onClick={() => this.controlAudio("inactive")}>
              <Button
                  color="white"
                  bgColor={this.props.currentColor}
                  text="Dừng lại"
                  borderRadius="10px"
                />
            </div>
          </div>
        </AudioAnalyser>
      </div>
      </div>
    );
  }
}
