// @ts-ignore
/* eslint-disable */

declare namespace API {
  type ErrorItem = {
    field?: string;
    message?: any;
  };

  type CurrentUser = {
    success?: boolean;
    data?: {
      username?: string;
      access_token?: string;
      avatar?: string;
      email?: string;
      type?: number;
      // tags?: { key?: string; label?: string }[];
      id: number;
      type_formatted?: string;
      mobile_phone?: string;
    };
    error?: ErrorItem[];
  };

  type LoginResult = CurrentUser;

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type Links = {
    self: {
      href: string;
    };
    first: {
      href: string;
    };
    last: {
      href: string;
    };
  };

  type Pagination = {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    prePage: number;
  };

  type MemberListItem = {
    id?: number;
    login_count?: number;
    type?: number;
    type_formatted?: string;
    avatar?: string;
    username?: string;
    created_at?: number;
    creator?: number;
    mobile_phone?: string;
  };

  type MemberList = {
    success: boolean;
    data?: {
      items: MemberListItem[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type ReissueOrderList = {
    success: boolean;
    data?: {
      items: ReissueOrderItem[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type ReissueOrderItem = {
    id?: number;
    order?: Order;
    type?: number;
    image?: string;
    remark?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type Order = {
    id?: number;
    order_number?: string;
    batch_id?: number;
    country?: string;
    consignee_name?: string;
    custom_info?: string;
    sku?: string;
    email?: string;
    shop_id?: number;
    product_quantity?: number;
    remark?: string;
    paid_at?: number;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type OrderBatch = {
    id?: number;
    name?: string;
    process?: string;
    quantity?: number;
    stepDetails?: object;
    remark?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type OrderList = {
    success: boolean;
    data?: {
      items: Order[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type OrderBatchList = {
    success: boolean;
    data?: {
      items: OrderBatch[];
      _links: Links;
      _meta: Pagination;
    };
  };

  // @todo 修改
  type Product = {
    id?: number;
    order_number?: string;
    shop_id?: number;
    tracking_number?: string;
    has_face_sheet?: boolean;
    is_pick_up?: boolean;
    remark?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type ProductList = {
    success: boolean;
    data?: {
      items: Product[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  // type FakeCaptcha = {
  //   code?: number;
  //   status?: string;
  // };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    // type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
