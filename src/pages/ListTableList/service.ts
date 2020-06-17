import request from '@/utils/request';
import { menuItem } from './data.d';

export async function getMenuList(): Promise<any> {
  return request('http://mhshjy.cc/nsolid/spi/v1/system/menu/getMenuList');
}

export async function queryRule(params?: menuItem) {
  return request('/rule', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: menuItem) {
  return request('/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: menuItem) {
  return request('/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
