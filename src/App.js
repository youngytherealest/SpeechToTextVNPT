import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Overview, Orders, Calendar, Employees, Stacked, Pyramid, AudioList, Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor, Record, Upload, Account } from './pages';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import "./style.scss";

import { useStateContext } from './contexts/ContextProvider';
import { checkValidToken } from './apis/api';
import { useNavigate } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Main/>
    </BrowserRouter>)
}

const Main = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings, userToken, setUserToken } = useStateContext();
  let currentUser = localStorage.getItem("accessToken");
  const navigate = useNavigate(); 

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    currentUser = localStorage.getItem("accessToken");
    let token = localStorage.getItem("accessToken");
    if (token != ""){
      
    }else{
      localStorage.setItem("accessToken","");
      navigate(`/login`);
    }
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      {currentUser ? (
        <>
          <div className="flex relative dark:bg-main-dark-bg">
            <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
              <TooltipComponent
                content="Settings"
                position="Top"
              >
                <button
                  type="button"
                  onClick={() => setThemeSettings(true)}
                  style={{ background: currentColor, borderRadius: '50%' }}
                  className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                >
                  <FiSettings />
                </button>

              </TooltipComponent>
            </div>
            {activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )}
            <div
              className={
                activeMenu
                  ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                  : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
              }
            >
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar />
              </div>
              <div>
                {themeSettings && (<ThemeSettings />)}

                <Routes>
                  {/* dashboard  */}
                  <Route path="/" element={(<Overview />)} />
                  <Route path="/overview" element={(<Overview />)} />

                  {/* pages  */}
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/audiolist" element={<AudioList/>} />
                  <Route path="/category_account" element={<Account/>} />

                  {/* apps  */}
                  <Route path="/kanban" element={<Kanban />} />
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/record" element={<Record />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/color-picker" element={<ColorPicker />} />

                  {/* charts  */}
                  <Route path="/line" element={<Line />} />
                  <Route path="/area" element={<Area />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/financial" element={<Financial />} />
                  <Route path="/color-mapping" element={<ColorMapping />} />
                  <Route path="/pyramid" element={<Pyramid />} />
                  <Route path="/stacked" element={<Stacked />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Navigate replace to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
