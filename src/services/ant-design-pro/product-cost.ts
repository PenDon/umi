import { request } from 'umi';

// 独立站产品报价API
/** 获取产品报价列表 GET /index.php/api/erp/product-cost/index */
export async function productCost(
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
  const response = await request<API.ProductCostList>('/index.php/api/erp/product-cost/index', {
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

/** 修改独立站产品报价 POST /index.php/api/erp/product-cost/update */
export async function updateProductCost(
  params: { id: string | undefined },
  options?: { [p: string]: any },
) {
  return request<API.ProductCost>('/index.php/api/erp/product-cost/update', {
    method: 'POST',
    params: { ...params },
    data: { ...(options || {}) },
  });
}

/** 新建独立站产品报价 POST /index.php/api/erp/product-cost/create */
export async function addProductCost(params?: object) {
  return request<API.ProductCost>('/index.php/api/erp/product-cost/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除独立站产品报价 POST /index.php/api/erp/product-cost/delete */
export async function removeProductCost(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/erp/product-cost/delete', {
    method: 'POST',
    params: { ...params },
  });
}

