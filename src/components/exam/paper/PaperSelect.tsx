/* 选题抽屉 */
import { RepoManage, RepoChapterGroupAdd } from '@/services/examManage';
import { useState, useEffect } from 'react';
import moment from 'moment';
import SelectRow from '@/components/exam/paper/SelectRow';
import { Button, Card, Select, Table } from 'antd';

const { Option } = Select;

export default function PaperSelect(props: { questionType?: string; paperSelectType?: number; close?: Function }) {
  const [page, setPage] = useState({
    current: 1,
    pages: 1,
    size: 5,
    total: 1,
  });

  const [repoList, setRepoList] = useState<API.RepoManagePaging>();

  const queryRepoList = async (current = page.current, size = page.size) => {
    try {
      const currentRepoList = await RepoManage({
        data: {
          current: current,
          size: size,
          params: {
            title: '',
          },
          t: moment().unix(),
        },
      });
      setPage({
        current: currentRepoList.data.current,
        pages: currentRepoList.data.pages,
        size: currentRepoList.data.size,
        total: currentRepoList.data.total,
      });
      setRepoList(currentRepoList.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isUnmount = false;
    !isUnmount && queryRepoList();
    return () => {
      isUnmount = true;
    };
  }, [props.paperSelectType, props.questionType]);

  const columns = [
    {
      title: '题库名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '试题数量',
      dataIndex: 'quCount',
      key: 'quCount',
    },
    {
      title: '操作',
      key: 'update',
      render: (text: unknown, record: API.RepoManage) => {
        return (
          <>
            <Button type="primary" className="mx-1">
              选定
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="w-full my-4  flex">
        <div className="w-64">
          <Select disabled className="w-64 w-64" value={props.questionType}>
            <Option value="1">单选题</Option>
            <Option value="2">多选题</Option>
            <Option value="3">判断题</Option>
            <Option value="4">简答题</Option>
            <Option value="5">填空题</Option>
          </Select>
        </div>
        <div className="ml-2 w-64">
          <Select disabled className="w-64" value={props.paperSelectType}>
            <Option value={1}>抽题组卷</Option>
            <Option value={2}>选题组卷</Option>
            <Option value={3}>随机组卷</Option>
          </Select>
        </div>
      </div>
      <Card>
        <div className="flex">
          <div className="flex-grow">
            {repoList && (
              <Table
                size="small"
                bordered
                columns={columns}
                dataSource={repoList.records}
                rowKey={'id'}
                expandable={{
                  expandRowByClick: true,
                  expandedRowRender: (record) => (
                    <SelectRow
                      key={record.id}
                      repoId={record.id}
                      repoTitle={record.title}
                      questionType={props.questionType}
                      paperSelectType={props.paperSelectType}
                      close={props.close}
                    ></SelectRow>
                  ),
                  rowExpandable: (record) => true,
                }}
                pagination={{ defaultCurrent: page.current, defaultPageSize: page.size, total: page.total }}
                onChange={(pagination) => {
                  queryRepoList(pagination.current, pagination.pageSize);
                }}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
