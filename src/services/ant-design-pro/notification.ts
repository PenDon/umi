// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

// notification API

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
