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
    type?: number;
    type_formatted?: string;
    avatar?: string;
    username?: string;
    created_at?: number;
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
