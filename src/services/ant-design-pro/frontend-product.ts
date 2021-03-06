import { request } from 'umi';

// 前台产品API
/** 获取前台产品 GET /index.php/api/frontend/product/index */
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
  const response = await request<API.ListResponse<API.FrontendProduct>>('/index.php/api/frontend/product/index', {
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

/** 修改前台产品 POST /index.php/api/frontend/product/update */
export async function updateProduct(
  params: { id: number | undefined },
  data?: { [p: string]: any },
) {
  return request<API.FrontendProduct>('/index.php/api/frontend/product/update', {
    method: 'POST',
    params: { ...params },
    data: { ...(data || {}) },
  });
}

/** 新建前台产品 POST /index.php/api/frontend/product/create */
export async function addProduct(params?: object) {
  return request<API.FrontendProduct>('/index.php/api/frontend/product/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除前台产品 POST /index.php/api/frontend/product/delete */
export async function removeProduct(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/frontend/product/delete', {
    method: 'POST',
    params: { ...params },
  });
}

/** 前台产品类别列表 GET /index.php/api/frontend/product/list-category */
export async function listCategory() {
  return request<any>('/index.php/api/frontend/product/list-category', {
    method: 'GET'
  });
}

