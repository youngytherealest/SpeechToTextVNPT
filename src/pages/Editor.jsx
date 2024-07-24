import React from 'react';
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { useNavigate , useParams } from 'react-router-dom'; // Import useHistory và useParams từ react-router-dom

import { Header } from '../components';
import { EditorData } from '../data/dummy';

const Editor = () => {
  const history = useNavigate(); // Sử dụng hook useHistory để điều hướng
  const params = useParams(); // Sử dụng hook useParams để lấy tham số từ URL

  // Thêm logic xử lý khi người dùng muốn quay lại trang trước đó
  const goBack = () => {
    history.goBack(); // Quay lại trang trước đó
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Editor" />
      <button onClick={goBack}>Back</button> {/* Nút quay lại trang trước */}
      <RichTextEditorComponent>
        <EditorData />
        <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
      </RichTextEditorComponent>
    </div>
  );
};

export default Editor;
