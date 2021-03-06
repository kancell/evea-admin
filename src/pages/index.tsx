import { processExam } from '@/services/exam';
import React, { ReactChild, useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import { message, Carousel, Image } from 'antd';

export default function IndexPage(): ReactChild {
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  const userData = initialState as { user: API.userData };
  const [nowProcessExam, setNowProcessExam] = useState<API.ProcessExam>();
  const queryCurrentExam = async () => {
    try {
      const processExamResult = await processExam();
      processExamResult.data !== undefined ? setNowProcessExam(processExamResult.data) : setNowProcessExam(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    queryCurrentExam();
  }, []);

  /* 后续通过公告进行 */
  let carouselImg = [
    'https://img.zcool.cn/community/01c77f5d9c517fa8012060be53caa7.jpg@1280w_1l_2o_100sh.jpg',
    'https://img.zcool.cn/community/01726a5d9c518da8012060beb10db2.jpg@1280w_1l_0o_100sh.jpg',
  ];

  return (
    <section className="text-gray-600 body-font">
      <div>
        <Carousel>
          {carouselImg.map((url, index) => (
            <div key={index} className="mx-auto h-36 bg-white lg:h-48">
              <Image src={`${url}`} />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="container px-5 py-8 md:py-24 mx-auto">
        <div className="flex flex-col text-left w-full mb-8 md:mb-16">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">欢迎来到{process.env.TITLE}</h1>
          <h2 className="text-sm text-indigo-500 tracking-widest font-medium title-font mb-1">
            你好，{userData.user.realName}
          </h2>
        </div>
        <div className="flex flex-wrap -m-4">
          <div className={`p-4 w-full md:w-1/3 ${nowProcessExam ? '' : 'hidden'}`}>
            <div className="flex rounded-lg h-full bg-gray-50 p-8 flex-col">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 text-lg title-font font-medium font-bold">未交卷的考试</h2>
              </div>
              <div
                onClick={() => {
                  !nowProcessExam && message.info('当前没有未交卷的考试');
                  nowProcessExam &&
                    history.push({
                      pathname: '/exam/exam/paper',
                      query: {
                        id: nowProcessExam.id,
                      },
                    });
                }}
                className="flex-grow cursor-pointer"
              >
                <p className="leading-relaxed text-base"></p>
                <a className="mt-3 text-indigo-500 inline-flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                  <span className="mx-2">
                    {nowProcessExam ? `您的考试 “${nowProcessExam.title}” 还没有交卷，点击返回考试` : '暂无'}
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="p-4 w-full md:w-1/3">
            <div className="flex rounded-lg h-full bg-gray-50 px-8 py-6 flex-col">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h2 className="text-gray-900 text-lg title-font font-medium font-bold">我的考试</h2>
              </div>
              <div
                onClick={() => {
                  history.push({
                    pathname: '/exam/exam',
                  });
                }}
                className="flex-grow cursor-pointer"
              >
                <p className="leading-relaxed text-base"></p>
                <a className="mt-3 text-indigo-500 inline-flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                  <span className="mx-2">点击查看当前可以进行的全部考试</span>
                </a>
              </div>
            </div>
          </div>
          <div className="p-4 w-full md:w-1/3">
            <div className="flex rounded-lg h-full bg-gray-50 px-8 py-6 flex-col">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="6" cy="6" r="3"></circle>
                    <circle cx="6" cy="18" r="3"></circle>
                    <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 text-lg title-font font-medium font-bold">我的成绩</h2>
              </div>
              <div
                onClick={() => {
                  history.push({
                    pathname: '/exam/record',
                  });
                }}
                className="flex-grow cursor-pointer"
              >
                <p className="leading-relaxed text-base"></p>
                <a className="mt-3 text-indigo-500 inline-flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                  <span className="mx-2">点击查看考试的历史记录与成绩</span>
                </a>
              </div>
            </div>
          </div>
          <div className="p-4 w-full md:w-1/3">
            <div className="flex rounded-lg h-full bg-gray-50 px-8 py-6 flex-col">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="6" cy="6" r="3"></circle>
                    <circle cx="6" cy="18" r="3"></circle>
                    <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 text-lg title-font font-medium font-bold">我的练习</h2>
              </div>
              <div
                onClick={() => {
                  history.push({
                    pathname: '/exam/practice',
                  });
                }}
                className="flex-grow cursor-pointer"
              >
                <p className="leading-relaxed text-base"></p>
                <a className="mt-3 text-indigo-500 inline-flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                  <span className="mx-2">点击前往题库训练</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
