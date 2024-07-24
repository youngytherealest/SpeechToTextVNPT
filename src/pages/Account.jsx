import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter, CommandColumn, click } from '@syncfusion/ej2-react-grids';
import { customersData, customersGrid } from '../data/dummy';
import { Header } from '../components';
import { getListTaiKhoan } from '../apis/api';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  let grid;
  let rowData;
  const navigate = useNavigate();
  const editOptions = { allowEditing: true, allowDeleting: true };
  const [taikhoanData, setTaiKhoanData] = useState([]);
  const initListTaiKhoan = () => {
    const token = localStorage.getItem("accessToken");
    getListTaiKhoan({token:token}).then(
      response => {
        setTaiKhoanData(response.data);
      }
    )
  }
  const commands = [
    {
        buttonOption: {
            content: 'Reset', cssClass: 'custom-resetmk-btn'
        }
    }
  ];
  const resetPassword = (args) => {
    const row = args.rowData;
      if (window.confirm(`Bạn có chắc muốn reset lại mật khẩu cho tài khoản ${row.username}?`)) {
        // Xử lý logic reset password ở đây
        console.log(row);
      } else {
        // Xử lý khi người dùng không xác nhận reset
        console.log(row);
      }
  };
  const actionComplete = (args) => {
    console.log(args.rowData)
    // Kiểm tra nếu hành động là 'resetmk' và gọi hàm resetPassword
    if (args.requestType === 'command' && args.action === 'resetmk') {
      resetPassword(args);
    }
  };
  const taikhoanGrid = [
    { field: 'fullname',
    headerText: 'Họ tên',
    width: '150',
    textAlign: 'left' },
      { field: 'username',
      headerText: 'Tài khoản',
      width: '100',
      textAlign: 'left' },
      { field: 'email',
      headerText: 'Email',
      width: '150',
      textAlign: 'left' },
      { field: 'phone',
      headerText: 'Số điện thoại',
      width: '150',
      textAlign: 'left' },
      { headerText: 'Thao tác',
       width: '150',
       textAlign: 'Center',
       commands: [{ type: 'resetmk', key:'resetmk', buttonOption: { content: 'Reset', cssClass: 'custom-resetmk-btn', click: actionComplete} },
                  { type: 'edit', key:'edit', buttonOption: { content: 'Sửa', cssClass: 'custom-edit-btn'} },
                   { type: 'delete', key:'delete', buttonOption: { content: 'Xóa', cssClass: 'custom-delete-btn' } }] }
  ];
  useEffect(() => {
    initListTaiKhoan();
  }, []);

  const formatDate = (fieldData) => {
    // Assuming fieldData is a date string like "2023-07-09T14:30:00"
    const format = getFormatFunction({skeleton: 'yMd', type: 'date'});
    return format(new Date(fieldData));
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header  title="Danh sách tài khoản" />
      <GridComponent
        dataSource={taikhoanData}
        enableHover={false}
        allowPaging
        pageSettings={{ pageSize: 10 }}
        //selectionSettings={selectionsettings}
        //toolbar={toolbarOptions}
        editSettings={editOptions}
        allowSorting
        actionComplete={actionComplete}
        searchSettings={{ showSearchBar: true, operator: 'contains' }} // Cấu hình searchSettings để hiển thị thanh tìm kiếm
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {taikhoanGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}

        </ColumnsDirective >
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, CommandColumn]} />
      </GridComponent>
    </div>
  );
};

export default Account;
