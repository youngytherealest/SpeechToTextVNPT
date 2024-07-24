import React, { Component } from "react";
import AudioAnalyser from "react-audio-analyser";
import axios from "axios";
import { Button } from "../components";
import { speechToText } from "../apis/api";

export default class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      
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
    this.setState({
      audioType: "audio/wav"
    });
  }

  render() {
    const { status, audioSrc, audioType } = this.state;
    const audioProps = {
      audioType,
      // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
      status,
      audioSrc,
      timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
      startCallback: e => {
      },
      pauseCallback: e => {
      },
      stopCallback: e => {
        this.setState({
          audioSrc: window.URL.createObjectURL(e)
        });
        let name = String(Math.floor(Math.random() * 100) + 1) + '.wav'
        var wavefilefromblob = new File([e], name);
        var formData = new FormData();

        formData.append("file", wavefilefromblob);
        formData.append("token", this.props.userToken);
        formData.append("enable_lm", 1);
        formData.append("denoise", 0);
        formData.append("keyframe", 0);
        formData.append("model", " ");

        speechToText(formData).then(
          response => {
            this.props.setMessages(messages => (
              [...messages, response.Result]
              ));
          }
        )

      },
      onRecordCallback: e => {

      },
      errorCallback: err => {

      },
      backgroundColor: "rgba(237, 247, 249, 1)",
      strokeColor: "#03C9D7"
    };
    return (
      <div>
        <AudioAnalyser {...audioProps}>
          <div className="btn-box">
            <div onClick={() => this.controlAudio("recording")}>
              <Button
                color="white"
                bgColor={this.props.currentColor}
                text="Start"
                borderRadius="10px"
              />
            </div>
            <div onClick={() => this.controlAudio("paused")}>
              <Button
                  color="white"
                  bgColor={this.props.currentColor}
                  text="Pause"
                  borderRadius="10px"
                />
            </div>
            <div onClick={() => this.controlAudio("inactive")}>
              <Button
                  color="white"
                  bgColor={this.props.currentColor}
                  text="Stop"
                  borderRadius="10px"
                />
            </div>
          </div>
        </AudioAnalyser>
      </div>
    );
  }
}
