import { Form, Button, Table, Modal, Card, Input, Select, TreeSelect, message } from 'antd';
import { useState, useEffect } from 'react';
import {
  userList as getUserList,
  roleList as getRoleList,
  departTree as getDepartTree,
  userDetail as getUserDetail,
  userSave,
  userDelete,
} from '@/services/setting';
import moment from 'moment';

const { Option } = Select;

const initUser: API.User = {
  idCard: '',
  password: '',
  realName: '',
  deptCode: '',
  roles: [],
  userName: '',
  email: '',
};

export default function User() {
  const [verifyVisible, setVerifyVisible] = useState(false);
  const verifyShow = () => {
    queryRoleList();
    queryDepartTree();
    setVerifyVisible(true);
  };

  const handleCancel = () => {
    setVerifyVisible(false);
  };

  const [page, setPage] = useState({
    current: 1,
    pages: 1,
    size: 10,
    total: 1,
  });
  const [userList, setUserList] = useState<API.UserPaging>();
  const queryUserList = async (current = page.current, size = page.size) => {
    try {
      const currentExamList = await getUserList({
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

  const [roleList, setRoleList] = useState<API.Role[]>();
  const queryRoleList = async () => {
    const result = await getRoleList({});
    setRoleList(result.data);
  };

  const [Tree, setTree] = useState<API.Tree[]>();
  const queryDepartTree = async () => {
    const result = await getDepartTree({});
    setTree(TransformDepartTree(result.data));
  };
  const TransformDepartTree = (data: API.Depart[]): API.Tree[] => {
    const item: API.Tree[] = [];
    data.map((depart, index) => {
      const option: API.Tree = {};
      option.title = depart.deptName;
      option.value = depart.deptCode;
      option.children = depart.children === undefined ? [] : TransformDepartTree(depart.children);
      item.push(option);
    });
    return item;
  };

  const [form] = Form.useForm();
  const [userDetail, setUserDetail] = useState<API.User>();
  const queryUserDetail = async (id: string) => {
    try {
      const result = await getUserDetail({
        data: {
          id: id,
        },
      });
      form.setFieldsValue(result.data);
      setUserDetail(result.data);
    } catch (error) {}
  };

  const submit = async () => {
    try {
      const result = await userSave({
        data: userDetail,
      });
      if (result.success) {
        message.success('????????????');
        handleCancel();
        queryUserList();
      }
    } catch (error) {}
  };

  const deleteUser = async (id: string) => {
    const ids = [];
    ids.push(id);
    try {
      const result = await userDelete({
        data: {
          ids: ids,
        },
      });
      if (result.success) {
        message.success('????????????');
        queryUserList();
      }
    } catch (error) {}
  };

  const columns = [
    {
      title: '????????????',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '??????',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '????????????',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: '????????????',
      dataIndex: 'deptCode',
      key: 'deptCode',
    },
    {
      title: '??????',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: '??????',
      key: 'action',
      render: (text: unknown, record: API.User) => {
        return (
          <>
            <Button
              className="m-1"
              onClick={() => {
                if (!record.id) return;
                verifyShow();
                queryUserDetail(record.id);
              }}
            >
              ??????
            </Button>
            <Button
              danger
              className="m-1"
              onClick={() => {
                if (!record.id) return;
                deleteUser(record.id);
              }}
            >
              ??????
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Modal
        title="????????????"
        visible={verifyVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            ??????
          </Button>,
        ]}
      >
        <Card title="">
          <Form
            form={form}
            name="basic"
            initialValues={userDetail}
            onFinish={submit}
            onValuesChange={(changedFields, allFields) => {
              setUserDetail({ ...userDetail, ...allFields });
            }}
          >
            <Form.Item name="userName" rules={[{ required: true, message: '?????????????????????' }]}>
              <Input addonBefore="????????????"></Input>
            </Form.Item>
            <Form.Item name="realName" rules={[{ required: true, message: '????????????????????????' }]}>
              <Input addonBefore="????????????"></Input>
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '???????????????' }]}>
              <Input addonBefore="????????????"></Input>
            </Form.Item>
            <Form.Item name="deptCode" label="????????????" rules={[{ required: true, message: '???????????????' }]}>
              <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                className="w-full"
                treeDefaultExpandAll
                treeData={Tree}
              ></TreeSelect>
            </Form.Item>
            <Form.Item name="roles" label="????????????" rules={[{ required: true, message: '?????????????????????!' }]}>
              <Select mode="multiple" allowClear className="w-full">
                {roleList?.map((item) => (
                  <Option key={item.roleType} value={item.id}>
                    {item.roleName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="email">
              <Input addonBefore="????????????"></Input>
            </Form.Item>
            <Form.Item name="idCard">
              <Input addonBefore="????????????"></Input>
            </Form.Item>
            {/*             <Form.Item
              name="phone"
            >
              <Input addonBefore="????????????"></Input>
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                ??????
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <div className="bg-white p-2 mb-2">
        <Button
          type="primary"
          shape="round"
          onClick={() => {
            setUserDetail(initUser);
            form.setFieldsValue(initUser);
            verifyShow();
          }}
        >
          ??????????????????
        </Button>
      </div>
      <div className="px-2 bg-white">
        {userList && (
          <Table
            columns={columns}
            dataSource={userList.records}
            rowKey={'id'}
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
