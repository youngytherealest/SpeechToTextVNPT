  import React, {useEffect, useState} from 'react';
  import {GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter, CommandColumn, click } from '@syncfusion/ej2-react-grids';
  import { customersData, customersGrid } from '../data/dummy';
  import { Header } from '../components';
  import { getListAudio } from '../apis/api';
  import { useNavigate } from 'react-router-dom';
  import { getValue } from '@syncfusion/ej2-base';
  import  Editor from './Editor';
  import { saveAs } from 'file-saver';
  import { Document, Packer, Paragraph, TextRun } from 'docx';

  const AudioList = () => {
    const navigate = useNavigate();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const selectionsettings = { persistSelection: true };
    const toolbarOptions = [
      'Search'
    ];
    const editing = { allowDeleting: false, allowEditing: false };
    const [audioData, setAudioData] = useState([]);
    const initListAudio = () => {
      const token = localStorage.getItem("accessToken");
      getListAudio({token:token}).then(
        response => {
          //console.log(response.detail);
          if(response.detail){
            localStorage.clear();
            navigate(`/login`);
          }else{
            setAudioData(response.data);
          }
        }
      )
    }
    const handleDialogOpen = (data) => {
      setSelectedData(data);
      setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleSave = (updatedData) => {
      // Update data logic here
      console.log('Saving data:', updatedData);
      // After saving, you might want to update the state or refetch data
      setDialogOpen(false);
    };
    
    useEffect(() => {
      initListAudio();
    }, []);


    const convertSeconds = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = (totalSeconds % 3600) % 60;

      return { hours, minutes, seconds };
    };
    const commandClick = (args) => {
      //console.log(args);
      const { commandColumn, rowData } = args;
      if (commandColumn) {
          if (commandColumn.key === 'expr') {
            var tmp = '';
            rowData.data.forEach(item => {
              tmp = tmp + item.text;
            });
            handleExportClick(tmp, rowData);
          }
      }
    };
    const handleExportClick = (data, row) => {
      if (!data) {
          console.log("No data found");
          return;
      }
  
      // Tạo tài liệu Word mới
      const doc = new Document({
          sections: [
              {
                  properties: {},
                  children: [
                      new Paragraph({
                          children: [
                              new TextRun({
                                text: `${data || 'N/A'}`,
                                size: 28,
                              }),
                          ],
                      }),
                  ],
              },
          ],
      });
  
      // Chuyển đổi tài liệu thành Blob
      Packer.toBlob(doc).then((blob) => {
          saveAs(blob, 'ketqua_stt_'+ row.audio_name +'.docx');
      }).catch((error) => {
          console.error("Error exporting to Word:", error);
      });
    };
    // const cellRender = (args) => {
    //   console.log("ádsdfgdhfdsd")
    //   if (args.column.field === 'data') {
    //     const dataArray = args.data[args.column.field];
    //     if (Array.isArray(dataArray)) {
    //       args.cell.innerHTML = dataArray
    //         .map(item => `<div style="background-color: #f0f0f0; padding: 5px; margin-bottom: 5px; border-left: 5px solid #007bff;">${item.text}</div>`)
    //         .join('');
    //     } else {
    //       args.cell.innerHTML = 'Invalid data format';
    //     }
    //   }
    //   if (args.column.field === 'duration') {
    //     const seconds = parseFloat(args.data[args.column.field]);
    //     const { hours, minutes, seconds: sec } = convertSeconds(seconds);
    //     args.cell.innerHTML = `${hours}h ${minutes}m ${sec.toFixed(3)}s`;
    //   }
    // };
    const actionComplete = (args) => {
      console.log(args.requestType)
      if (args.form) {
          if ((args.requestType === 'beginEdit')) {
              /** Add Validation Rules */
              args.form.ej2_instances[0].addRules('Freight', { max: 500 });
              handleDialogOpen(args.rowData);
              args.cancel = true; // Prevent default dialog
          }
          /** Set initial Focus */
          if (args.requestType === 'beginEdit') {
              args.form.elements.namedItem('CustomerID').focus();
          }
          else if (args.requestType === 'add') {
              args.form.elements.namedItem('OrderID').focus();
          }
      }
  };
  const actionBegin = (args) => {
    if (args.requestType === 'save' && args.form) {
        /** cast string to integer value */
        setValue('data.Freight', parseFloat(args.form.querySelector("#Freight").value), args);
    }
  };
    const thoiLuongFormat = (field, data, column) => {
      const { hours, minutes, seconds } = convertSeconds(getValue('duration', data));
      if(hours == 0 && minutes == 0){
        return `${seconds.toFixed(0)} giây`;
      }else if(hours == 0){
        return `${minutes} phút ${seconds.toFixed(0)} giây`;
      }
      else{
        return `${hours} giờ ${minutes} phút ${seconds.toFixed(0)} giây`;
      }
    };
    const ketQuagFormat = (field, data, column) => {
      const arr = getValue('data', data);
      var tmp = ''
      arr.forEach(item => {
        tmp = tmp + item.text;
      });
      return tmp;
      
    };
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header  title="Danh sách bản ghi cuộc họp" />
        <GridComponent
          dataSource={audioData}
          enableHover={false}
          allowPaging
          pageSettings={{ pageSize: 10 }}
          toolbar={toolbarOptions}
          editSettings={editing}
          allowSorting
          commandClick={commandClick}
          actionComplete={actionComplete}
          searchSettings={{ showSearchBar: true, operator: 'contains' }} // Cấu hình searchSettings để hiển thị thanh tìm kiếm
        >
          <ColumnsDirective>
              <ColumnDirective field='audio_name' width='100' textAlign="Left"  headerText='File'/>
              <ColumnDirective field='duration' width='100' headerText='Thời lượng' valueAccessor={thoiLuongFormat} textAlign="Center"/>
              <ColumnDirective field='created_date' width='100' textAlign="Center" headerText='Thời gian tạo' format="dd/MM/yyyy HH:mm:ss" type='dateTime'/>
              <ColumnDirective field='data' width='100' headerText='Kết quả' valueAccessor={ketQuagFormat}/>
              <ColumnDirective width='100' headerText='Thao tác' textAlign="Center" commands={[
                        {
                            type: 'Tải xuống file word kết quả đã chuyển', key:'expr',
                            buttonOption: {
                                content: '',
                                cssClass: 'e-flat custom-button',
                                iconCss: 'e-export e-icons',
                                tooltipText: 'Tải xuống file word',
                                click: (args) => commandClick(args)
                            }
                        },
                    ]}
              
              />
          </ColumnsDirective>
          <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, CommandColumn]} />
        </GridComponent>
        {selectedData && (
                <Editor
                    isOpen={isDialogOpen}
                    onClose={handleDialogClose}
                    data={selectedData}
                    onSave={handleSave}
                />
            )}
      </div>
    );
  };

  export default AudioList;
