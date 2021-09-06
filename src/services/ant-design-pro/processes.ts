// @ts-ignore
/* eslint-disable */
// @ts-ignore
import { request } from 'umi';

// 流程API
/** 获取流程列表 GET /index.php/api/erp/process/index */
export async function processes(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sorter: object,
  options?: { [key: string]: any },
) {
  // 前端排序字段处理
  let sortObj = {};
  if (sorter) {
    for (let key in sorter) {
      sortObj['sort'] = sorter[key] == 'ascend' ? key : '-' + key;
      break;
    }
  }
  const response = await request<API.ProcessList>('/index.php/api/erp/process/index', {
    method: 'GET',
    params: {
      ...params,
      ...sortObj,
    },
    ...(options || {}),
  });
  return {
    data: response?.data?.items,
    success: response.success,
    total: response.data?._meta.totalCount,
  };
}

/** 修改流程 PUT /index.php/api/erp/process/update */
export async function updateProcess(
  params: { id: number | undefined },
  options?: { [p: string]: any },
) {
  console.log(params);
  return request<API.Process>('/index.php/api/erp/process/update', {
    method: 'PUT',
    params: { ...params },
    data: { ...(options || {}) },
  });
}

/** 新建流程 POST /index.php/api/erp/process/create */
export async function addProcess(params?: object) {
  return request<API.Process>('/index.php/api/erp/process/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除流程 POST /index.php/api/erp/process/delete */
export async function removeProcess(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/erp/process/delete', {
    method: 'POST',
    params: { ...params },
  });
}
