import { Button, Card, Input, Select, Form, Drawer, Checkbox, Radio, message } from 'antd';
import { useState, useEffect } from 'react';
import PaperSelect from '@/components/exam/paper/PaperSelect';
import { selectOption } from '@/services/selectOption';
import { useModel, history, useLocation } from 'umi';
import QuestionEdit from '@/components/exam/question/QuestionEdit';
import { PaperSave, PaperUpdate } from '@/services/examManage';

const { Option } = Select;

export default function PaperAdd() {
  const { paperEditData, setPaperEditData } = useModel('usePaperGenerate');
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const location = useLocation();
  const queryLocationData = location as unknown as queryLocation;
  const paperEditDataInit = async () => {
    if (queryLocationData.query === undefined) {
      return;
    }
    try {
      const result = await PaperUpdate({
        data: {
          id: queryLocationData.query.id,
        },
      });
      setPaperEditData(result.data);
    } catch (error) {}
  };
  useEffect(() => {
    paperEditDataInit();
  }, []);

  const [nowSelectQuestionType, setNowSelectQuestionType] = useState('1');

  const [joinType, setJoinType] = useState<API.SelectOption[]>();
  const [tmplType, setTmplType] = useState<API.SelectOption[]>();
  const getSelectOption = async () => {
    try {
      const JoinResult = await selectOption({
        data: {
          dicCode: 'join_type',
        },
      });
      setJoinType(JoinResult.data);
      const catLogResult = await selectOption({
        data: {
          dicCode: 'tmpl_catalog',
        },
      });
      setTmplType(catLogResult.data);
    } catch (error) {}
  };
  useEffect(() => {
    let isUnmount = false;
    !isUnmount && getSelectOption();
    return () => {
      isUnmount = true;
    };
  }, []);

  useEffect(() => {
    let isUnmount = false;
    !isUnmount && paperSaveParams();
    return () => {
      isUnmount = true;
    };
  }, [paperEditData?.groupList?.length]);

  const paperSaveParams = () => {
    let quCount: number = 0;
    let totalScore: number = 0;
    paperEditData?.groupList?.forEach((item: API.RepoQuestionGroupList) => {
      item.quCount === undefined ? '' : (quCount += item.quCount);
      item.totalScore === undefined ? '' : (totalScore += item.totalScore);
    });
    setPaperEditData({ ...paperEditData, quCount: quCount, totalScore: totalScore, timeType: 1 });
  };

  const paperSave = async () => {
    try {
      const result = await PaperSave({
        data: paperEditData,
      });
      message.info(result.msg);
      history.push('/examManage/paper');
    } catch (error) {}
  };

  const paperQuestionGroupDelete = (index: number) => {
    const cacheGroupList = paperEditData?.groupList;
    cacheGroupList?.splice(index, 1);
    setPaperEditData({ ...paperEditData, groupList: cacheGroupList });
  };

  return (
    <>
      <Drawer title="???????????????" placement="right" closable={false} width={'61.8%'} onClose={onClose} visible={visible}>
        <PaperSelect
          close={onClose}
          questionType={nowSelectQuestionType}
          paperSelectType={paperEditData?.joinType}
        ></PaperSelect>
      </Drawer>
      <Card title="????????????">
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap max-w-4xl">
            <div className="flex justify-between flex-wrap">
              <div className="flex-grow m-2 w-full">
                <Input
                  onChange={(e) => setPaperEditData({ ...paperEditData, title: e.target.value })}
                  addonBefore="????????????"
                  value={paperEditData?.title}
                />
              </div>
              <div className="flex-grow m-2">
                <Radio.Group
                  value={Number(paperEditData?.joinType)}
                  disabled={!(paperEditData?.groupList === undefined || paperEditData?.groupList.length === 0)}
                  onChange={(e) => setPaperEditData({ ...paperEditData, joinType: Number(e.target.value) })}
                >
                  {joinType?.map((item) => (
                    <Radio.Button key={item.id} value={Number(item.value)}>
                      {item.title}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
              <div className="w-48 m-2">
                <Input disabled addonBefore="????????????" value={paperEditData?.totalScore} />
              </div>
              <div className="w-48 m-2">
                <Input disabled addonBefore="????????????" value={paperEditData?.quCount} />
              </div>
              <div className="flex-grow m-2">
                <Select
                  onChange={(value) => {
                    if (!value) return;
                    setPaperEditData({ ...paperEditData, catId: value.toString() });
                  }}
                  placeholder="????????????"
                  className="w-full"
                  value={paperEditData?.catId}
                >
                  {tmplType?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded w-80">
            <div className="w-full my-2">
              <Button onClick={() => paperSave()} className="w-full" type="primary" htmlType="submit">
                ????????????
              </Button>
            </div>
            <div className="w-full my-3 flex flex-wrap justify-between">
              <div className="w-1/2 m-1">
                <Select
                  onChange={(value) => {
                    setNowSelectQuestionType(value);
                  }}
                  className="w-full"
                  value={nowSelectQuestionType}
                >
                  <Option value="1">?????????</Option>
                  <Option value="2">?????????</Option>
                  <Option value="3">?????????</Option>
                  <Option value="4">?????????</Option>
                  <Option value="5">?????????</Option>
                </Select>
              </div>
              <Button
                disabled={paperEditData?.joinType === undefined}
                type="primary"
                className="w-24 m-1"
                onClick={() => showDrawer()}
              >
                ???????????????
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <div className="p-2">
        {paperEditData?.groupList?.map((group: API.RepoQuestionGroupList, index: number) => (
          <div key={index}>
            <div className="my-2 flex flex-wrap bg-white p-2 rounded border">
              <div className="w-64 m-1">
                <Input
                  addonBefore="???????????????"
                  value={group.title}
                  onChange={(e) => {
                    const groupList = paperEditData?.groupList;
                    if (groupList !== undefined) {
                      groupList[index].title = e.target.value;
                    }
                    setPaperEditData({ ...paperEditData, groupList: groupList });
                  }}
                ></Input>
              </div>
              <div className="flex items-center flex-wrap">
                <span className="m-1">
                  <Input
                    onChange={(e) => {
                      const groupList = paperEditData?.groupList;
                      if (groupList !== undefined && group.quList) {
                        groupList[index].perScore = Number(e.target.value);
                        groupList[index].totalScore = Number(e.target.value) * group.quList.length;
                      }
                      groupList?.forEach((group: API.RepoQuestionGroupList) => {
                        group.quList?.forEach((question) => {
                          question.score = Number(e.target.value);
                        });
                      });
                      setPaperEditData({ ...paperEditData, groupList: groupList });
                      paperSaveParams();
                    }}
                    value={group.perScore}
                    addonBefore="????????????"
                    addonAfter={`??????${group.quCount}??????????????????${
                      group.quCount && group.perScore && group.quCount * group.perScore
                    }??????`}
                    type="number"
                  />
                </span>
                <span className="my-1 mx-4">
                  <Checkbox
                    onChange={(e) => {
                      const groupList = paperEditData?.groupList;
                      if (groupList !== undefined) {
                        groupList[index].itemRand = e.target.checked;
                      }
                      setPaperEditData({ ...paperEditData, groupList: groupList });
                    }}
                  >
                    ????????????
                  </Checkbox>
                </span>
                <span className="my-1">
                  <Checkbox
                    onChange={(e) => {
                      const groupList = paperEditData?.groupList;
                      if (groupList !== undefined) {
                        groupList[index].quRand = e.target.checked;
                      }
                      setPaperEditData({ ...paperEditData, groupList: groupList });
                    }}
                    className="m-1"
                  >
                    ????????????
                  </Checkbox>
                </span>
                <span className="my-1">
                  <Checkbox
                    onChange={(e) => {
                      const groupList = paperEditData?.groupList;
                      if (groupList !== undefined) {
                        groupList[index].pathScore = e.target.checked;
                      }
                      setPaperEditData({ ...paperEditData, groupList: groupList });
                    }}
                    className="m-1"
                  >
                    ?????????????????????
                  </Checkbox>
                </span>
              </div>
              <Button type="primary" className="m-1 ">
                ????????????
              </Button>
              <Button type="primary" danger className="m-1" onClick={() => paperQuestionGroupDelete(index)}>
                ??????????????????
              </Button>
            </div>

            {(paperEditData.joinType === 1 || paperEditData.joinType === 2) &&
              group?.quList?.map((question, index) => <QuestionEdit key={question.quId} content={question}></QuestionEdit>)}
            {paperEditData.joinType === 3 &&
              group?.ruleList?.map((rule, index) => {
                const questionType = {
                  '1': '?????????',
                  '2': '?????????',
                  '3': '?????????',
                  '4': '?????????',
                  '5': '?????????',
                }[rule.quType !== undefined ? rule.quType : '1'];
                return (
                  <div className="my-2" key={index}>
                    <Card title={<div className="px-2 py-1 font-bold text-base">{'????????????'}</div>} size="small">
                      <div className="m-2 text-base">???{rule.repoTitle}???????????????</div>
                      <div className="m-2 text-base">
                        ???????????????{questionType}?????????????????????{rule.num}?????????????????????{rule.levelTitle}???
                      </div>
                    </Card>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </>
  );
}
