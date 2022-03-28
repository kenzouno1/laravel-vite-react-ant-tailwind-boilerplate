import { Space, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined, BellOutlined, DollarOutlined } from '@ant-design/icons';
import React, { useContext, useState } from 'react';
import Avatar from './avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GlobalHeaderRight = () => {
  const [openNotify, setOpenNotify] = useState(false)
  return (
    <Space size={"middle"}>
      <div className=" relative text-center cursor-pointer" onClick={() => setOpenNotify(a => a ? false : true)}>
        <FontAwesomeIcon className="text-white pt-5" size="xl" icon="fa-regular fa-bell" />
        <div className="p-1 bg-red-600 absolute top-2 -right-3 flex items-center justify-center rounded-full text-xs text-white font-bold">15</div>
        {
          openNotify &&
          <div className="absolute top-18 right-0 bg-white w-80 p-4 rounded-xl text-left shadow-lg shadow-zinc-300  flex flex-col leading-10">
            <div className='border-b-2 border-gray-100'>
              Lorem ipsum dolor sit amet
            </div>
            <div className='border-b-2 border-gray-100'>
              Lorem ipsum dolor sit amet
            </div>
            <div className='border-b-2 border-gray-100'>
              Lorem ipsum dolor sit amet
            </div>
            <div className='border-b-2 border-gray-100'>
              Lorem ipsum dolor sit amet
            </div>
          </div>
        }
      </div>

      <Avatar />
    </Space>
  );
};
export default GlobalHeaderRight;

