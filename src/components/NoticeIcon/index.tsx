import { useEffect, useState } from 'react';
import { Tag, message } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
// import { useModel } from 'umi';
import { getNotices } from '@/services/ant-design-pro/api';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import React from 'react';
import {
  clear,
  read,
} from '@/services/ant-design-pro/notification';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const getNoticeData = (notices: API.NoticeIconItem[]): Record<string, API.NoticeIconItem[]> => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {};
  }

  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };

    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime as string).fromNow();
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }

    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold',
      }[newNotice.status];
      newNotice.extra = (
        <Tag
          color={color}
          style={{
            marginRight: 0,
          }}
        >
          {newNotice.extra}
        </Tag>
      ) as any;
    }

    return newNotice;
  });
  return groupBy(newNotices, 'type');
};

const getUnreadData = (noticeData: Record<string, API.NoticeIconItem[]>) => {
  const unreadMsg: Record<string, number> = {};
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key];

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0;
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => !item.read).length;
    }
  });
  return unreadMsg;
};

const NoticeIconView = () => {
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};
  const [notices, setNotices] = useState<API.NoticeIconItem[]>([]);

  useEffect(() => {
    getNotices({show: 1}).then(({ data }) => setNotices(data || []))
    let intervalId = setInterval(() => {
      getNotices({show: 1}).then(({ data }) => setNotices(data || []))
    }, 1000 * 30);
    return () => {
      clearInterval(intervalId);
      // @ts-ignore
      intervalId = null;
    }
  }, [])
  const noticeData = getNoticeData(notices);
  const unreadMsg = getUnreadData(noticeData || {});
  const changeReadState = async (id: string) => {
    const { success } = await read({ id: id });
    if (success) {
      setNotices(
        notices.map((item) => {
          const notice = { ...item };
          if (notice.id === id) {
            notice.read = true;
          }
          return notice;
        })
      );
    }

  };

  const clearReadState = async () => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.read === true) {
          return {};
        }
        return notice;
      }),
    );
    const response = await clear()
    if (response) {
      message.success(`${'?????????'}`);
    }
  };

  return (
    <NoticeIcon
      className={styles.action}
      count={unreadMsg.notification}
      onItemClick={(item) => {
        if (item.read != true) {
          changeReadState(item.id!);
        }
        window.location.href=`/#/workspace/orders?id=${item.order_id}`
      }}
      onClear={() => clearReadState()}
      loading={false}
      clearText="??????"
      viewMoreText="????????????"
      onViewMore={() => message.info('Click on view more')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData.notification}
        title="??????"
        emptyText="????????????????????????"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData.message}
        title="??????"
        emptyText="????????????????????????"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        title="??????"
        emptyText="????????????????????????"
        count={unreadMsg.event}
        list={noticeData.event}
        showViewMore
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
