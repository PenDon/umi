import { request } from 'umi';

// 邮件模板API
/** 获取邮件模板列表 GET /index.php/api/erp/mail-template/index */
export async function mailTemplates(
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
  const response = await request<API.MailTemplateList>('/index.php/api/erp/mail-template/index', {
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

/** 开启检测 POST /index.php/api/erp/mail-template/check-email */
export async function checkEmail(params?: object) {
  return request<Record<string, boolean>>('/index.php/api/erp/mail-template/check-email', {
    method: 'POST',
    data: { ...params },
  });
}

/** 修改邮件模板 POST /index.php/api/erp/mail-template/update */
export async function updateMailTemplate(
  params: { id: string | undefined },
  options?: { [p: string]: any },
) {
  return request<API.MailTemplate>('/index.php/api/erp/mail-template/update', {
    method: 'POST',
    params: { ...params },
    data: { ...(options || {}) },
  });
}

/** 新建邮件模板 POST /index.php/api/erp/mail-template/create */
export async function addMailTemplate(params?: object) {
  return request<API.MailTemplate>('/index.php/api/erp/mail-template/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除邮件模板 POST /index.php/api/erp/mail-template/delete */
export async function removeMailTemplate(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/erp/mail-template/delete', {
    method: 'POST',
    params: { ...params },
  });
}

/** 邮件模板列表 GET /index.php/api/erp/mail-template/list */
export async function listMailTemplate() {
  return request<API.ListResponse<API.MailTemplate>>('/index.php/api/erp/mail-template/list', {
    method: 'GET',
  });
}
