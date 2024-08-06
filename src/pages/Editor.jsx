import React, { useState } from 'react';
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { useNavigate , useParams } from 'react-router-dom'; // Import useHistory và useParams từ react-router-dom
import { DataUtil } from '@syncfusion/ej2-data';
import { Header } from '../components';
import { EditorData } from '../data/dummy';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

const Editor = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);
  const history = useNavigate(); // Sử dụng hook useHistory để điều hướng
  const params = useParams(); // Sử dụng hook useParams để lấy tham số từ URL

  // Thêm logic xử lý khi người dùng muốn quay lại trang trước đó
  const goBack = () => {
    history.goBack(); // Quay lại trang trước đó
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSave = () => {
      onSave(formData);
      onClose();
  };
  return (
    <DialogComponent
    header='Chỉnh sửa thông tin'
    visible={isOpen}
    width='400px'
    showCloseIcon={true}
    close={onClose}
    buttons={[
        { click: handleSave, buttonModel: { content: 'Save', isPrimary: true } },
        { click: onClose, buttonModel: { content: 'Cancel' } }
    ]}
    >
        <div>
            <label>File Name:</label>
            <input
                type='text'
                name='audio_name'
                value={formData.audio_name || ''}
                onChange={handleInputChange}
            />
        </div>
        <div>
            <label>Duration:</label>
            <input
                type='text'
                name='duration'
                value={formData.duration || ''}
                onChange={handleInputChange}
            />
        </div>
        {/* Add other fields here */}
    </DialogComponent>
  );
};

export default Editor;
