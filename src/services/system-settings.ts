import request from '@/utils/request';

export async function getMenuList(): Promise<any> {
  return request('/system/menu/getMenuList');
}
