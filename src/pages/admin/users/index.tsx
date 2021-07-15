import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
// @ts-ignore
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { members, addMember, updateMember, removeMember } from '@/services/ant-design-pro/api';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addMember({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateMember({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.MemberListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeMember({
      ids: selectedRows.map((row) => row.id).join(','),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.MemberListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.MemberListItem[]>([]);

  /** 国际化配置 */
  const intl = useIntl();

  const columns: ProColumns<API.MemberListItem>[] = [
    // {
    //   title: '头像',
    //   dataIndex: 'avatar',
    //   renderText: (text) => {
    //     return (<img src={text} width={50}/>)
    //   }
    // },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.userName.nameLabel"
          defaultMessage="用户名"
        />
      ),
      dataIndex: 'username',
      tip: '用户名是唯一的 key',
      render: (dom, entity) => {
        return (
          <div>
            <img src={entity.avatar} width={50} />
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {dom}
            </a>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.mobilePhone" defaultMessage="手机号" />,
      dataIndex: 'mobile_phone',

      // valueType: 'datetime',
    },
    {
      title: '活动次数',
      dataIndex: 'login_count',
      sorter: true,
      search: false,
    },
    // {
    //   title: <FormattedMessage
    // id="pages.searchTable.titleCallNo"
    // defaultMessage="服务调用次数" />, dataIndex: 'callNo',
    // sorter: true, hideInForm: true, renderText: (val:
    // string) => `${val}${intl.formatMessage({ id:
    // 'pages.searchTable.tenThousand', defaultMessage: ' 万
    // ', })}`, },
    {
      title: <FormattedMessage id="pages.searchTable.type" defaultMessage="用户类型" />,
      dataIndex: 'type',
      hideInForm: true,
      sorter: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.supervisor"
              defaultMessage="部门主管"
            />
          ),
          type: 0,
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.admin" defaultMessage="系统管理员" />
          ),
          type: 1,
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.yunying" defaultMessage="运营人员" />
          ),
          type: 2,
        },
        3: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.cangchu" defaultMessage="仓储人员" />
          ),
          type: 3,
        },
        4: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.caiwu" defaultMessage="财务人员" />
          ),
          type: 4,
        },
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'created_at',
      renderText: (text: number) => {
        return text * 1000;
      },
      valueType: 'dateTime',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    // {
    //   title: (
    //     <FormattedMessage
    // id="pages.searchTable.titleUpdatedAt"
    // defaultMessage="上次调度时间" /> ), sorter: true,
    // dataIndex: 'updatedAt', valueType: 'dateTime',
    // renderFormItem: (item, { defaultRender, ...rest },
    // form) => { const status =
    // form.getFieldValue('status'); if (`${status}` ===
    // '0') { return false; } if (`${status}` === '3') {
    // return ( <Input {...rest}
    // placeholder={intl.formatMessage({ id:
    // 'pages.searchTable.exception', defaultMessage:
    // '请输入异常原因！', })} /> ); } return defaultRender(item);
    // }, },

    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.update" defaultMessage="修改" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.MemberListItem, API.PageParams>
        headerTitle="员工列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{ defaultPageSize: 10 }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined />
            <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        // pagination={true}
        request={members}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                {/* <FormattedMessage */}
                {/*  id="pages.searchTable.totalServiceCalls" */}
                {/*  defaultMessage="服务调用次数总计" */}
                {/* />{' '} */}
                {/* {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '} */}
                {/* <FormattedMessage id="pages.searchTable.tenThousand" */}
                {/*                  defaultMessage="万" /> */}
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
          <Button type="primary">
            <FormattedMessage id="pages.searchTable.batchApproval" defaultMessage="批量审批" />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newMember',
          defaultMessage: '新建规则',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.MemberListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="规则名称为必填项"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.username && (
          <ProDescriptions<API.MemberListItem>
            column={2}
            title={currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.username,
            }}
            columns={columns as ProDescriptionsItemProps<API.MemberListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
