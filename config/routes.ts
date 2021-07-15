export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //   ],
  // },
  {
    name: 'admin',
    icon: 'apartment',
    path: '/admin',
    routes: [
      {
        name: 'users',
        // icon: 'user',
        path: '/admin/users',
        component: './admin/users',
      },
    ],
  },
  // {
  //   name: 'TableList',
  //   icon: 'list',
  //   path: '/table-list',
  //   component: './TableList',
  // },
  {
    name: 'manage',
    icon: 'group',
    path: '/manage',
    routes: [
      // {
      //   name: 'manages',
      //   path: '/admin/users',
      //   component: './manage/index',
      // },
      {
        name: 'orders',
        path: '/manage/orders',
        component: './manage/orders',
      },
      {
        path: '/manage/orders/:id',
        component: './manage/orders',
      },
      {
        name: 'orderBatch',
        path: '/manage/order-batch',
        component: './manage/orderBatch',
      },
      {
        name: 'process',
        path: '/manage/process',
        component: './manage/process',
      },

      // {
      //   name: 'orders',
      //   path: '/manage/orders',
      //   component: './manage/orders',
      // },
      // {
      //   name: 'products',
      //   path: '/manage/products',
      //   component: './manage/products',
      // },
    ],
  },
  {
    name: 'toDoList',
    icon: 'user',
    path: '/toDoList',
    routes: [
      {
        name: 'orders',
        // icon: 'user',
        path: '/toDoList/orders',
        component: './toDoList/orders',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
