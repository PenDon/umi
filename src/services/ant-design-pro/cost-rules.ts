// @ts-ignore
/* eslint-disable */
// @ts-ignore
import { request } from 'umi';

// 成本规则API
/** 获取成本规则列表 GET /index.php/api/cost/cost-rule/index */
export async function costRules(
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
  const response = await request<API.CostRuleList>('/index.php/api/cost/cost-rule/index', {
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

/** 导入Excel POST /index.php/api/cost/cost-rule/import-excel */
export async function importExcel(params?: object) {
  return request<API.Order>('/index.php/api/cost/cost-rule/import-excel', {
    method: 'POST',
    data: { ...params },
  });
}

/** 修改成本规则 PUT /index.php/api/cost/cost-rule/update */
export async function updateCostRule(
  params: { id: string | undefined },
  options?: { [p: string]: any },
) {
  return request<API.CostRule>('/index.php/api/cost/cost-rule/update', {
    method: 'PUT',
    params: { ...params },
    data: { ...(options || {}) },
  });
}

/** 新建成本规则 POST /index.php/api/cost/cost-rule/create */
export async function addCostRule(params?: object) {
  return request<API.CostRule>('/index.php/api/cost/cost-rule/create', {
    method: 'POST',
    data: { ...params },
  });
}

/** 删除成本规则 POST /index.php/api/cost/cost-rule/delete */
export async function removeCostRule(params: { ids: string }) {
  return request<Record<string, any>>('/index.php/api/cost/cost-rule/delete', {
    method: 'POST',
    params: { ...params },
  });
}
