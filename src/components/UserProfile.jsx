import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';
import { logout } from '../apis/api';
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { currentColor } = useStateContext();
  const { setUserToken } = useStateContext();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const fullname = localStorage.getItem("fullname");
  const is_admin = localStorage.getItem("is_admin");
  const phone = localStorage.getItem("phone");


  function logoutHandle() {
    //logout(localStorage.getItem("accessToken"));
    navigate("/login");
    localStorage.setItem("accessToken","")
    localStorage.setItem("refreshToken","")
    localStorage.setItem("id","");
    localStorage.setItem("email","");
    localStorage.setItem("username","");
    localStorage.setItem("fullname","");
    localStorage.setItem("is_admin","");
    localStorage.setItem("phone","");
    setUserToken("");
    
  }

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Thông tin cá nhân</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-l dark:text-gray-200"> {fullname} </p>
          {/* <p className="font-semibold text-xl dark:text-gray-200"> {username} </p> */}
          <p className="text-gray-500 text-sm dark:text-gray-400">  {is_admin == "true" ? "Administrator": "Người dùng"}  </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {email} </p>
        </div>
      </div>
      {/* <div>
        {userProfileData.map((item, index) => (
          <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
      </div> */}
      <div className="mt-5" onClick={logoutHandle}>
        <Button
          color="white"
          bgColor="red"
          text="Đăng xuất"
          borderRadius="10px"
          width="full"
        />
      </div>
    </div>

  );
};

export default UserProfile;
