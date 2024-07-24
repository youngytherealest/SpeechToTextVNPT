import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { loginAPI, userInfo } from "../apis/api";
import { Message } from "../components/Message";
import { useStateContext } from "../contexts/ContextProvider";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";

const Login = () => {
  const { setUserToken } = useStateContext();
  const [errorMessage, setErrorMessage] = useState("");
  //const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    localStorage.setItem("email",email);

    try {
        loginAPI({ email: email, password: password }).then(function (response) {
            if (response.access_token){
              userInfo({ token: response.access_token }).then(function (res) {
                //localStorage.setItem("email",res.email);
                localStorage.setItem("fullname",res.fullname);
                localStorage.setItem("is_admin",res.is_admin);
                localStorage.setItem("phone",res.phone);
              }).catch(function (error) {
                toastr.error('Lỗi lấy thông tin cá nhân')
              });
              localStorage.setItem("accessToken",response.access_token);
              localStorage.setItem("refreshToken",response.refresh_token);
              localStorage.setItem("id",response.user_id);
              setUserToken(response.access_token);  
              toastr.success('Đăng nhập thành công')              
              navigate("/");
            }else{
              toastr.error('Email hoặc mật khẩu không đúng!')
            }
        }).catch(function (error) {
          toastr.error('Có lỗi xảy ra')
        });
    
    } catch (err) {
      setErrorMessage("Có lỗi xảy ra.");
    }
  };


  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">VNPT - Speech To Text</span>
        <span className="title">Đăng nhập</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Tên đăng nhập" />
          <input type="password" placeholder="Mật khẩu" />
          <button>Đăng nhập</button>
        </form>
        <p></p>
      </div>
    </div>
  );
};

export default Login;