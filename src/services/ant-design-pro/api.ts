// @ts-ignore
/* eslint-disable */
// @ts-ignore
import { request } from 'umi';

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

//  规则API
/** 获取规则列表 GET /api/rule */
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
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

//  用户API

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/account/view', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/passport/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/passport/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户列表 GET /api/member/index */
export async function members(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sorter: {
    type?: string;
    created_at?: string;
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
  const response = await request<API.MemberList>('/api/member/index', {
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
/** 修改用户 PUT /api/member/update */
export async function updateMember(options?: { [key: string]: any }) {
  return request<API.MemberListItem>('/api/member/update', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建用户 POST /api/member/create */
export async function addMember(options?: { [key: string]: any }) {
  return request<API.MemberListItem>('/api/member/create', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除用户 POST /api/member/delete */
export async function removeMember(params?: { ids: string }) {
  console.log(params);
  return request<Record<string, any>>('/api/member/delete', {
    method: 'POST',
    params: { ...params },
  });
}

// //  补发订单API
// /** 获取补发订单列表 GET /api/reissue/default/index */
// export async function reissueOrders(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     /** 页面的容量 */
//     pageSize?: number;
//   },
//   sorter: {
//     type?: string,
//     created_at?: string,
//   },
//   options?: { [key: string]: any },
// ) {
//   // 前端排序字段处理
//   let sortObj = {};
//   if (sorter) {
//     for (let key in sorter) {
//       sortObj['sort'] = sorter[key] == 'ascend' ? key : '-' + key;
//       break;
//     }
//   }
//   const response = await request<API.ReissueOrderList>('/api/reissue/default/index', {
//     method: 'GET',
//     params: {
//       ...params, ...sortObj,
//     },
//     ...(options || {}),
//   });
//   return {
//     data: response?.data?.items,
//     success: response.success,
//     total: response.data?._meta.totalCount,
//   };
// }

/** 修改补发订单 POST /api/member/update */
export async function updateReissueOrder(options?: { [key: string]: any }) {
  return request<API.ReissueOrderItem>('/api/reissue/default/update', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 新建补发订单 POST /api/member/create */
export async function addReissueOrder(params?: object) {
  console.log('???????????');
  return request<API.ReissueOrderItem>('/api/reissue/default/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除补发订单 POST /api/reissue/default/delete */
export async function removeReissueOrder(params: { ids: string }) {
  return request<Record<string, any>>('/api/reissue/default/delete', {
    method: 'POST',
    params: { ...params },
  });
}

// 订单API
/** 获取订单列表 GET /api/erp/order/index */
export async function orders(
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
  const response = await request<API.OrderList>('/api/erp/orders/index', {
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

/** 修改订单 POST /api/member/update */
export async function updateOrder(options?: { [key: string]: any }) {
  return request<API.Order>('/api/erp/order/update', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 新建订单 POST /api/erp/order/create */
export async function addOrder(params?: object) {
  return request<API.Order>('/api/erp/order/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 导入订单Excel POST /api/erp/order/import-excel */
export async function importExcel(params?: object) {
  return request<API.Order>('/api/erp/order/import-excel', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除订单 POST /api/erp/order/delete */
export async function removeOrder(params: { ids: string }) {
  return request<Record<string, any>>('/api/erp/order/delete', {
    method: 'POST',
    params: { ...params },
  });
}

// 订单批次API
/** 获取订单列表 GET /api/erp/order-batch/index */
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
  const response = await request<API.OrderBatchList>('/api/erp/order-batch/index', {
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

// /** 修改订单 POST /api/erp/order-batch/update */
// export async function updatOrderBatch(options?: { [key: string]: any }) {
//   return request<API.ReissueOrderItem>('/api/erp/order-batch/update', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }

/** 修改订单 POST /api/erp/order-batch/update */
export async function updateOrderBatch(options?: { [key: string]: any }) {
  return request<API.ReissueOrderItem>('/api/erp/order-batch/update', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 新建订单 POST /api/erp/order-batch/create */
export async function addOrderBatch(params?: object) {
  return request<API.ReissueOrderItem>('/api/erp/order-batch/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除订单 POST /api/erp/order-batch/delete */
export async function removeOrderBatch(params: { ids: string }) {
  return request<Record<string, any>>('/api/erp/order-batch/delete', {
    method: 'POST',
    params: { ...params },
  });
}
