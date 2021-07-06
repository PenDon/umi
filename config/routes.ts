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
    icon: 'user',
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
    name: 'shop',
    icon: 'shop',
    path: '/shop',
    routes: [
      // {
      //   name: 'shops',
      //   path: '/admin/users',
      //   component: './shop/index',
      // },
      {
        name: 'orders',
        path: '/shop/orders',
        component: './shop/orders',
      },
      {
        name: 'orderBatch',
        path: '/shop/order-batch',
        component: './shop/orderBatch',
      },
      {
        name: 'process',
        path: '/shop/process',
        component: './shop/process',
      },

      // {
      //   name: 'orders',
      //   path: '/shop/orders',
      //   component: './shop/orders',
      // },
      // {
      //   name: 'products',
      //   path: '/shop/products',
      //   component: './shop/products',
      // },
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
