import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter, CommandColumn, click } from '@syncfusion/ej2-react-grids';
import { customersData, customersGrid } from '../data/dummy';
import { Header } from '../components';
import { getListAudio } from '../apis/api';
import { useNavigate } from 'react-router-dom';

const AudioList = () => {
  const navigate = useNavigate();
  const selectionsettings = { persistSelection: true };
  const toolbarOptions = [
    'Delete', 'Search'
  ];
  const handleEditClick = (args) => {
    const audioId = args.rowData.id; // Assuming id field exists in your audioData
    navigate(`/editor`);
  };
  
  const editing = { allowDeleting: true, allowEditing: true };
  const [audioData, setAudioData] = useState([]);
  const initListAudio = () => {
    const token = localStorage.getItem("accessToken");
    getListAudio({token:token}).then(
      response => {
        setAudioData(response.data);
      }
    )
  }
  const audioGrid = [
    { type: 'checkbox', width: '50' },
    { field: 'path',
    headerText: 'File',
    width: '150',
    textAlign: 'left' },
      { field: 'duration',
      headerText: 'Thời lượng',
      width: '100',
      textAlign: 'Center' },
      { field: 'update_at',
      headerText: 'Thời gian tạo',
      width: '150',
      textAlign: 'Center',
      type: 'dateTime',
      format: 'dd/MM/yyyy HH:mm:ss' },
      { field: 'content',
      headerText: 'Kết quả',
      width: '150',
      textAlign: 'left' },
      { headerText: 'Thao tác',
       width: '150',
       textAlign: 'Center',
       commands: [{ type: 'edit', key:'edit', buttonOption: { content: 'Sửa', cssClass: 'custom-edit-btn'} },
                   { type: 'delete', key:'delete', buttonOption: { content: 'Xóa', cssClass: 'custom-delete-btn' } }] }
  ];

  
  useEffect(() => {
    initListAudio();
  }, []);

  const formatDate = (fieldData) => {
    // Assuming fieldData is a date string like "2023-07-09T14:30:00"
    const format = getFormatFunction({skeleton: 'yMd', type: 'date'});
    return format(new Date(fieldData));
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header  title="Danh sách bản ghi cuộc họp" />
      <GridComponent
        dataSource={audioData}
        enableHover={false}
        allowPaging
        pageSettings={{ pageSize: 10 }}
        selectionSettings={selectionsettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting
        searchSettings={{ showSearchBar: true, operator: 'contains' }} // Cấu hình searchSettings để hiển thị thanh tìm kiếm
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {audioGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, CommandColumn]} />
      </GridComponent>
    </div>
  );
};

export default AudioList;
