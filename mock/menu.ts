import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /system/menu/getMenuList': {
    "success":true,
    "message":"OK",
    "code":200,
    "data": {
        "records":[{
            "id": "1",
            "parent_id": "0",
            "icon": "",
            "level": "1",
            "model": "",
            "controller": "",
            "action": "",
            "menu_text": "系统管理",
            "list_order": "1",
            "display": "1"
        },{
            "id": "2",
            "parent_id": "1",
            "icon": "",
            "level": "2",
            "model": "system",
            "controller": "admin",
            "action": "getAdminList",
            "menu_text": "管理用户",
            "list_order": "1",
            "display": "1"
        },{
            "id": "3",
            "parent_id": "1",
            "icon": "",
            "level": "2",
            "model": "system",
            "controller": "role",
            "action": "getRoleList",
            "menu_text": "权限角色",
            "list_order": "1",
            "display": "1"
        },{
            "id": "4",
            "parent_id": "1",
            "icon": "",
            "level": "2",
            "model": "system",
            "controller": "menu",
            "action": "getMenuList",
            "menu_text": "权限菜单",
            "list_order": "1",
            "display": "1"
        }]
     },
     "timestamp":"1585622391072"
  },
  'POST /api/login/account': (req: Request, res: Response) => {
    const { password, userName, type } = req.body;
    if (password === 'ant.design' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === 'ant.design' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
};
