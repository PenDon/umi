// @ts-ignore
import { request } from 'umi';

// notification API

// @ts-ignore
export const read = async (
  params: {
    id: string
  }
) => {
  return request<API.Common>('/index.php/api/common/notification/read', {
    method: 'GET',
    params: { ...params },
  })
};

export const clear = async () => {
  return request<API.Common>('/index.php/api/common/notification/clear', {
    method: 'POST',
  })
};
