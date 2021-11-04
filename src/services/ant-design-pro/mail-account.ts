// @ts-ignore
/* eslint-disable */
// @ts-ignore
import { request } from 'umi';

// 邮箱账户API
/** 获取邮箱账户列表 GET /index.php/api/erp/addresser/index */
export async function mailAccounts(
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
  const response = await request<API.MailAccountList>('/index.php/api/erp/addresser/index', {
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

/** 修改邮箱账户 POST /index.php/api/erp/addresser/update */
export async function updateMailAccount(
  params: { id: string | undefined },
  options?: { [p: string]: any },
) {
  return request<API.MailAccount>('/index.php/api/erp/addresser/update', {
    method: 'POST',
    params: { ...params },
    data: { ...(options || {}) },
  });
}

/** 新建邮箱账户 POST /index.php/api/erp/addresser/create */
export async function addMailAccount(params?: object) {
  return request<API.MailAccount>('/index.php/api/erp/addresser/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除邮箱账户 POST /index.php/api/erp/addresser/delete */
export async function removeMailAccount(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/erp/addresser/delete', {
    method: 'POST',
    params: { ...params },
  });
}

/** 邮箱账户列表 GET /index.php/api/erp/addresser/list */
export async function listMailAccount() {
  return request<API.ListResponse<API.MailAccount>>('/index.php/api/erp/addresser/list', {
    method: 'GET',
  });
}
