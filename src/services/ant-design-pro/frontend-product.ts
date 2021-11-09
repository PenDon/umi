import { request } from 'umi';

// 前台产品API
/** 获取前台产品 GET /index.php/api/product/default/index */
export async function products(
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
  const response = await request<API.ListResponse<API.FrontendProduct>>('/index.php/api/product/default/index', {
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

/** 修改前台产品 POST /index.php/api/product/default/update */
export async function updateProduct(
  params: { id: string | undefined },
  options?: { [p: string]: any },
) {
  return request<API.FrontendProduct>('/index.php/api/product/default/update', {
    method: 'POST',
    params: { ...params },
    data: { ...(options || {}) },
  });
}

/** 新建前台产品 POST /index.php/api/product/default/create */
export async function addProduct(params?: object) {
  return request<API.FrontendProduct>('/index.php/api/product/default/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除前台产品 POST /index.php/api/product/default/delete */
export async function removeProduct(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/product/default/delete', {
    method: 'POST',
    params: { ...params },
  });
}

