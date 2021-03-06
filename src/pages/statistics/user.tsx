import { Button, Table } from 'antd';
import { useState, useEffect } from 'react';
import { examStatis, userStatis } from '@/services/statistic';
import moment from 'moment';

export default function User() {
  const [page, setPage] = useState({
    current: 1,
    pages: 1,
    size: 10,
    total: 1,
  });
  const [userList, setUserList] = useState<API.ExamPaging>();
  const queryUserList = async (current = page.current, size = page.size) => {
    try {
      const currentExamList = await userStatis({
        data: {
          current: current,
          size: size,
          params: {},
          t: moment().unix(),
        },
      });
      setPage({
        current: currentExamList.data.current,
        pages: currentExamList.data.pages,
        size: currentExamList.data.size,
        total: currentExamList.data.total,
      });
      setUserList(currentExamList.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    queryUserList();
  }, []);

  const columns = [
    {
      title: '统计时间',
      dataIndex: 'dateStr',
      key: 'dateStr',
    },
    {
      title: '用户数量',
      dataIndex: 'allUser',
      key: 'allUser',
    },
    {
      title: '活跃用户',
      dataIndex: 'activeUser',
      key: 'activeUser',
    },
    {
      title: '新增用户',
      dataIndex: 'newUser',
      key: 'newUser',
    },
  ];

  return (
    <div>
      <div className="px-2 bg-white">
        {userList && (
          <Table
            columns={columns}
            dataSource={userList.records}
            rowKey={'dateStr'}
            pagination={{ defaultCurrent: page.current, total: page.total }}
            onChange={(pagination) => {
              queryUserList(pagination.current, pagination.pageSize);
            }}
          />
        )}
      </div>
    </div>
  );
}
