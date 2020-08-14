const menus = [
  {
    cName: '首页',
    path: '/home'
  },
  {
    cName: '系统管理',
    children: [
      {
        cName: '表格',
        path: '/table'
      }
    ]
  },
  {
    cName: '表单',
    children: [
      {
        cName: '登录',
        path: '/loginForm'
      },
      {
        cName: '修改密码',
        path: '/modifyPwdForm'
      },
      {
        cName: '基础表单',
        path: '/baseForm'
      }
    ]
  },
  {
    cName: '滚动展示',
    path: '/rollDetail'
  },
  {
    cName: '树结构',
    path: '/tree'
  },
  {
    cName: '自定义树结构',
    path: '/mtree'
  }
];


function addPrePath(menus, pre) {
  if (!menus || !pre) {
    return menus;
  }

  const newMenus = menus.map(menu => {
    let newMenu = {};
    newMenu.path = pre + menu.path;
    newMenu.cName = menu.cName;

    if (menu.children) {
      newMenu.children = addPrePath(menu.children, pre);
    }
    return newMenu;
  });

  return newMenus;
}


export const sideMenus = addPrePath(menus, '/side');
export const topMenus = addPrePath(menus, '/top');

