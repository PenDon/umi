// @ts-ignore
/* eslint-disable */
// @ts-ignore
import { request } from 'umi';

/** 此处后端没有提供注释 GET /index.php/api/notices */
export async function getNotices(params: object, options?: { [key: string]: any }) {
  const response = await request<API.NoticeIconList>('/index.php/api/common/notification/index', {
    method: 'GET',
    ...(options || {}),
    params: {...params}
  });
  return {data: response.data?.items};
}

//  规则API
/** 获取规则列表 GET /index.php/api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/index.php/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /index.php/api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/index.php/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /index.php/api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/index.php/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /index.php/api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/index.php/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

//  用户API

/** 获取当前的用户 GET /index.php/api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/index.php/api/account/view', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /index.php/api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/index.php/api/passport/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /index.php/api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/index.php/api/passport/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户列表 GET /index.php/api/member/index */
export async function members(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sorter: {},
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
  const response = await request<API.MemberList>('/index.php/api/member/index', {
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

// @todo 修改为传递数据data
/** 修改用户 PUT /index.php/api/member/update */
export async function updateMember(options?: { [key: string]: any }, params?: object, data?: object) {
  return request<API.MemberListItem>('/index.php/api/member/update', {
    method: 'PUT',
    ...(options || {}),
    params: params,
    data: data
  });
}

// @ts-ignore
/** 新建用户 POST /index.php/api/passport/register */
export async function addMember({ options, data }: { options?: { [p: string]: any }, data: any }) {
  return request<API.MemberListItem>('/index.php/api/passport/register', {
    method: 'POST',
    ...(options || {}),
    data: data
  });
}

/** 删除用户 POST /index.php/api/member/delete */
export async function removeMember(params?: { ids: string }) {
  console.log(params);
  return request<Record<string, any>>('/index.php/api/member/delete', {
    method: 'POST',
    params: { ...params },
  });
}

//  补发订单API
/** 获取补发订单列表 GET /index.php/api/reissue/default/index */
export async function reissueOrders(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sorter: {
    type?: string,
    created_at?: string,
  },
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
  const response = await request<API.ReissueOrderList>('/index.php/api/reissue/default/index', {
    method: 'GET',
    params: {
      ...params, ...sortObj,
    },
    ...(options || {}),
  });
  return {
    data: response?.data?.items,
    success: response.success,
    total: response.data?._meta.totalCount,
  };
}

/** 修改补发订单 POST /index.php/api/member/update */
export async function updateReissueOrder(options?: { [key: string]: any }) {
  return request<API.ReissueOrderItem>('/index.php/api/reissue/default/update', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 新建补发订单 POST /index.php/api/member/create */
export async function addReissueOrder(params?: object) {
  return request<API.ReissueOrderItem>('/index.php/api/reissue/default/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除补发订单 POST /index.php/api/reissue/default/delete */
export async function removeReissueOrder(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/reissue/default/delete', {
    method: 'POST',
    params: { ...params },
  });
}

/** 补发订单导出 GET /index.php/api/reissue/default/to-excel */
export async function reissueOrderToExcel(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/reissue/default/to-excel', {
    method: 'GET',
    params: { ...params },
  });
}

// 订单API
/** 获取订单列表 GET /index.php/api/erp/order/index */
export async function orders(
  params: API.Order & {
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
  const response = await request<API.OrderList>('/index.php/api/erp/order/index', {
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

/** 步骤列表 GET /index.php/api/member/update */
export async function stepList() {
  return request<any>('/index.php/api/erp/order/step-list');
}

/** 部门列表 GET /index.php/api/erp/process/list-department */
export async function departmentList() {
  return request<any>('/index.php/api/erp/process/list-department');
}

/** 修改订单 POST /index.php/api/member/update */
export async function updateOrder(params: object, data: object, options?: { [key: string]: any }) {
  return request<API.Order>('/index.php/api/erp/order/update', {
    method: 'PUT',
    params: {...params},
    data: {...data},
    ...(options || {}),
  });
}

/** 新建订单 POST /index.php/api/erp/order/create */
export async function addOrder(params?: object) {
  return request<API.Order>('/index.php/api/erp/order/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 导入订单Excel POST /index.php/api/erp/order/import-excel */
export async function importExcel(params?: object) {
  return request<API.Order>('/index.php/api/erp/order/import-excel', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除订单 POST /index.php/api/erp/order/delete */
export async function removeOrder(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/erp/order/delete', {
    method: 'POST',
    params: { ...params },
  });
}

// 订单批次API
/** 获取订单批次列表 GET /index.php/api/erp/order-batch/index */
export async function orderBatch(
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
  const response = await request<API.OrderBatchList>('/index.php/api/erp/order-batch/index', {
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

/** 修改订单批次 POST /index.php/api/erp/order-batch/update */
export async function updateOrderBatch(params?: { [key: string]: any }, data?: {[key: string]: any}) {
  return request<API.OrderBatch>('/index.php/api/erp/order-batch/update', {
    method: 'POST',
    params: params,
    data: data,
  });
}

/** 新建订单批次 POST /index.php/api/erp/order-batch/create */
export async function addOrderBatch(params?: object) {
  return request<API.OrderBatch>('/index.php/api/erp/order-batch/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除订单批次 POST /index.php/api/erp/order-batch/delete */
export async function removeOrderBatch(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/erp/order-batch/delete', {
    method: 'POST',
    params: { ...params },
  });
}

/** 订单批次安排下一步 POST /index.php/api/erp/order-batch/further-step */
export async function batchFurtherStep(params?: object) {
  return request<API.OrderBatch>('/index.php/api/erp/order-batch/further-step', {
    method: 'POST',
    data: { ...params },
  });
}
/** 员工领取任务接口 POST /index.php/api/erp/order-batch/pick-up */
export async function batchPickUp(params: { ids: string}) {
  return request<Record<string, any>>('/index.php/api/erp/order-batch/pick-up', {
    method: 'POST',
    params: { ...params },
  });
}

/** 员工提交任务接口 POST /index.php/api/erp/order-batch/submit */
export async function batchSubmit(params: { ids: string, save_path?: string }) {
  return request<Record<string, any>>('/index.php/api/erp/order-batch/submit', {
    method: 'POST',
    params: { ...params },
  });
}


/** 审核接口 POST /index.php/api/erp/order-batch/pick-up */
export async function batchCheck(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/erp/order-batch/check', {
    method: 'POST',
    params: { ...params },
  });
}

//  部门CRUD API
/** 获取补发订单列表 GET /index.php/api/erp/department/index */
export async function departments(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sorter: {
    type?: string,
    created_at?: string,
  },
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
  const response = await request<API.DepartmentList>('/index.php/api/erp/department/index', {
    method: 'GET',
    params: {
      ...params, ...sortObj,
      parent_id: 1,
    },
    ...(options || {}),
  });
  return {
    data: response?.data?.items,
    success: response.success,
    total: response.data?._meta.totalCount,
  };
}

/** 修改部门 POST /index.php/api/erp/department/update */
export async function updateDepartment(options?: { [key: string]: any }, params?: object, data?: object) {
  return request<API.Department>('/index.php/api/erp/department/update', {
    method: 'POST',
    ...(options || {}),
    params: {...params},
    data: {...data},
  });
}

/** 新建补发订单 POST /index.php/api/member/create */
export async function addDepartment(params?: object) {
  return request<API.Department>('/index.php/api/erp/department/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除补发订单 POST /index.php/api/reissue/default/delete */
export async function removeDepartment(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/erp/department/delete', {
    method: 'POST',
    params: { ...params },
  });
}

