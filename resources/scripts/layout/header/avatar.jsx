import React, { useContext } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { Dropdown } from 'antd';
import classNames from 'classnames';
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AvatarDropdown = ({ menu }) => {
  const navigate = useNavigate();

  // const { profile } = useContext(AccountContext);


  const menuHeaderDropdown = (
    <Menu>
      <Menu.Item>
        <a className='flex items-center gap-4'>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" /> Thoát
        </a>
      </Menu.Item>
      {/* <Menu.Item>
        <a className='flex items-center gap-4'>
          <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" />   Setting
        </a>
      </Menu.Item> */}
    </Menu>
  );

  return (
      <Dropdown overlay={menuHeaderDropdown}>
        <div className="flex items-center gap-2">
          <Avatar size={50} src={"https://image.winudf.com/v2/image/Y29tLnN1bW1lcmFwcHMuY2FyZ2lybHN3YWxscGFwZXJzX3NjcmVlbl80XzE1MzQ2NDkxNzBfMDQw/screen-4.jpg?fakeurl=1&type=.jpg"}
            icon={<UserOutlined />} alt="avatar" />
          <div className="flex flex-col">
            {/* <p className={`ml-1 font-semibold font-sans text-base text-white`}>{profile.name}</p> */}
          </div>
        </div>
      </Dropdown>
  );
};

export default AvatarDropdown;
