import { request } from 'umi';

/** 获取当前进行中的考试 POST exam/api/paper/paper/check-process */
export async function processExam(options?: { [key: string]: any }) {
  return request<API.wrapProcessExam>('/exam/api/paper/paper/check-process', {
    method: 'POST',
    ...(options || {}),
  });
}
/* 获取当前的考试列表 */
export async function currentExam(options?: { [key: string]: any }) {
  return request<API.wrapExamPaging>('/exam/api/exam/exam/online-paging', {
    method: 'POST',
    ...(options || {}),
  });
}

/* 传入考试examId创建试卷 */
export async function createExam(options?: { [key: string]: any }) {
  return request<API.wrapUnknownResult>('/exam/api/paper/paper/create-paper', {
    method: 'POST',
    ...(options || {}),
  });
}
/* 传入createExam返回值中试卷id，获取试卷详细内容 */
export async function examContent(options?: { [key: string]: any }) {
  return request<API.wrapPaperDetail>('/exam/api/paper/paper/paper-detail', {
    method: 'POST',
    ...(options || {}),
  });
}
/* 传入问题id，获取试卷详细内容 */
export async function questionContent(options?: { [key: string]: any }) {
  return request<API.wrapQuestion>('/exam/api/paper/paper/qu-detail', {
    method: 'POST',
    ...(options || {}),
  });
}
/* 传入问题详细信息，提交本问题答案 */
export async function fillAnswer(options?: { [key: string]: any }) {
  return request<API.wrapUnknownResult>('/exam/api/paper/paper/fill-answer', {
    method: 'POST',
    ...(options || {}),
  });
}
/* 传入试卷id，提交试卷 */
export async function fillExam(options?: { [key: string]: any }) {
  return request<API.wrapUnknownResult>('/exam/api/paper/paper/hand-exam', {
    method: 'POST',
    ...(options || {}),
  });
}

/* 获取试卷批阅信息 */
export async function examResult(options?: { [key: string]: any }) {
  return request<API.wrapPaperResult>('/exam/api/paper/paper/paper-result', {
    method: 'POST',
    ...(options || {}),
  });
}
/* 参加过的考试列表 */
export async function PaperRecord(options?: { [key: string]: any }) {
  return request<API.wrapPaperRecord>('/exam/api/user/exam/my-paging', {
    method: 'POST',
    ...(options || {}),
  });
}
/* 对应试卷的考试记录 */
export async function ExamRecordPaging(options?: { [key: string]: any }) {
  return request<API.wrapExamRecordPaging>('/exam/api/paper/paper/my-paging', {
    method: 'POST',
    ...(options || {}),
  });
}
