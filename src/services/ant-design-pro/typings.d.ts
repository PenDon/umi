// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Common = {
    success: boolean;
  }

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
      category_id?: number;
      type_formatted?: string;
      mobile_phone?: string;
    };
    error?: ErrorItem[];
  };

  type LoginResult = CurrentUser;

  type PageParams = {
    current?: number;
    pageSize?: number;
    pick_up_member_id?: string | null;
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
    category_id?: number;
    login_count?: number;
    type?: number;
    type_formatted?: string;
    avatar?: string;
    username?: string;
    created_at?: number;
    creator?: number;
    mobile_phone?: string;
    remark?: string;
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
    order_number?: string;
    type?: number;
    type_formatted?: string;
    has_order?: number;
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
    batch?: OrderBatch;
    batch_name?: string;
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
    operations?: OrderOperation[];
    is_custom_info_modified?: boolean;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type OrderBatch = {
    id?: number;
    name?: string;
    save_path?: string;
    process?: string;
    process_id?: number;
    quantity?: number;
    stepDetails: StepDetail[];
    status?: number;
    step_id?: number;
    step?: Step;
    remark?: string;
    arranged?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type StepDetail = {
    id?: number;
    name?: number;
    type?: number;
    created_at?: number;
    username: string;
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

  // @todo ??????
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
    /** ????????????????????? */
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

  // type ErrorResponse = {
  //   /** ???????????????????????? */
  //   errorCode: string;
  //   /** ???????????????????????? */
  //   errorMessage?: string;
  //   /** ?????????????????????????????? */
  //   success?: boolean;
  // };

  type NoticeIconList = {
    data?: {
      items: NoticeIconItem[]
    };
    /** ????????????????????? */
    // total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    order_id?: string;
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

  // process
  type ProcessList = {
    success: boolean;
    data?: {
      items: Process[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type Process = {
    id?: number;
    name?: string;
    steps?: Step[];
    remark?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type Step = {
    name?: string;
    id?: number;
    sort: number;
    category_id?: number;
  };

  type OrderOperation = {
    id?: number;
    type?: number;
    order_id?: number;
    remark?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  }

  // department
  type DepartmentList = {
    success: boolean;
    data?: {
      items: Department[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type Department = {
    id?: number;
    name?: string;
    description?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  // ??????????????????
  type CostRuleList = {
    success: boolean;
    data?: {
      items: CostRule[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type CostRule = {
    id?: string;
    sku?: string;
    initial_price?: number;
    has_beads?: boolean;
    bead_price?: number;
    flag?: boolean;
    ruleValue?: CostRuleValue[];
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type CostRuleValue = {
    id?: string;
    rule_id?: string;
    keyword?: string;
    bead_price?: number;
    extra_cost?: number;
  };

  // ??????????????????Excel
  type CostExcelList = {
    success: boolean;
    data?: {
      items: CostExcel[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type CostExcel = {
    id?: string;
    file_path?: string;
    file_name?: string;
    created_at?: number;
  };

  // ????????????
  type ProductCostList = {
    success: boolean;
    data?: {
      items: ProductCost[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type ProductCost = {
    id: string;
    image?: string;
    sku?: string;
    material?: string;
    color?: string;
    standards?: string;
    cost?: string;
    bead_cost?: string;
    remark?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  // ????????????
  type MailAccountList = {
    success: boolean;
    data?: {
      items: MailAccount[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type MailAccount = {
    id: string;
    account: string;
    remark?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  // ??????????????????????????????
  type MailTemplateList = {
    success: boolean;
    data?: {
      items: MailTemplate[];
      _links: Links;
      _meta: Pagination;
    };
  };

  type MailTemplate = {
    id?: string;
    name?: string;
    subject?: string;
    body?: string;
    keywords?: Keyword[];
    remark?: string;
    created_at?: number;
    creator?: string;
    updated_at?: number;
    updater?: string;
  };

  type Keyword = {
    name?: string;
    id?: number;
    template_id: number;
    remark?: string;
  };

  // ??????????????????
  type ListResponse<T> = {
    success: boolean;
    data?: {
      items: T[],
      _links: Links;
      _meta: Pagination;
    };
    error?: ErrorItem[];
  }

  // ????????????
  type FrontendProduct = {
    id?: number;
    name?: string;
    images: FrontendProductImage[];
    category_name: string;
    category_id: number;
    brand?: string;
    origin_place?: string;
    certification?: string;
    model_number?: string;
    min_order_quantity?: string;
    price?: string;
    package_details?: string;
    delivery_time?: string;
    payment?: string;
    supply_ability?: string;
    description: string;
  }

  // ??????????????????
  type FrontendProductCategory = {
    id: number;
    name: string;
    products:FrontendProduct[];
  }
  // ??????????????????
  type FrontendProductImage = {
    id: number;
    product_id: number;
    real_path: string;
  }
}
