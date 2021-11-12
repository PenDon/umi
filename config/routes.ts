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
    access: 'canAdmin',
    routes: [
      {
        name: 'users',
        path: '/admin/users',
        component: './admin/users',
      },
      {
        name: 'departments',
        path: '/admin/departments',
        component: './admin/departments',
      },

    ],
  },
  {
    name: 'manage',
    icon: 'group',
    path: '/manage',
    access: 'canAdmin',
    routes: [
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
    ],
  },
  {
    name: 'after-sale',
    icon: 'exception',
    path: '/after-sale',
    routes: [
      {
        name: 'reissue-orders',
        // icon: 'user',
        path: '/after-sale/reissue-orders',
        component: './after-sale/reissue-orders',
      },
    ],
  },
  {
    name: 'todo',
    icon: 'project',
    path: '/todo',
    routes: [
      {
        name: 'orderBatch',
        // icon: 'user',
        path: '/todo/order-batch',
        component: './todo/orderBatch',
      },
    ],
  },
  {
    name: 'cost',
    icon: 'project',
    path: '/cost',
    routes: [
      {
        name: 'costRule',
        // icon: 'user',
        path: '/cost/cost-rule',
        component: './cost/cost-rule',
      },
      {
        name: 'excel',
        // icon: 'user',
        path: '/cost/excel',
        component: './cost/excel',
      },
      {
        name: 'productCost',
        // icon: 'user',
        path: '/cost/product-cost',
        component: './cost/product-cost',
      },
    ],
  },
  {
    name: 'mail',
    icon: 'project',
    path: '/mail',
    routes: [
      {
        name: 'account',
        // icon: 'user',
        path: '/mail/account',
        component: './mail/account',
      },
      {
        name: 'template',
        // icon: 'user',
        path: '/mail/template',
        component: './mail/template',
      },
    ],
  },
  {
    name: 'workspace',
    icon: 'laptop',
    path: '/workspace',
    routes: [
      {
        name: 'orderBatch',
        path: '/workspace/order-batch',
        component: './workspace/orderBatch',
      },
      {
        name: 'orders',
        path: '/workspace/orders',
        component: './workspace/orders',
      },
    ],
  },
  {
    name: 'frontend',
    icon: 'laptop',
    path: '/frontend',
    routes: [
      {
        name: 'product',
        path: '/frontend/product',
        component: './frontend/product',
      },
      // {
      //   name: 'orders',
      //   path: '/workspace/orders',
      //   component: './workspace/orders',
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
