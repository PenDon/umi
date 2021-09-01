import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
// @ts-ignore
import { useIntl, FormattedMessage } from 'umi';
import {
  PageContainer,
  FooterToolbar,
} from '@ant-design/pro-layout';
import type {
  ProColumns,
  ActionType,
} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {
  members,
  addMember,
  updateMember,
  removeMember,
  departmentList,
} from '@/services/ant-design-pro/api';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.MemberListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addMember({ options: {}, data: { ...fields } });
    hide();
    message.success('添加成功');
    ``;
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
    await updateMember({}, {id: fields.id}, {...fields});
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

const departmentRequest = async () => {
  const response = await departmentList();
  let d = [];
  for (const item in response.data) {
    d.push({"label": response.data[item], "value": item})
  }

  // return response.data;
  return d;
};

const TableList: React.FC = () => {
  /** state departmentList */
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.MemberListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.MemberListItem[]>([]);

  /** 国际化配置 */
    // const intl = useIntl();

  const columns: ProColumns<API.MemberListItem>[] = [
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
              <img src={entity.avatar}
                   width={50} />
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
        title: <FormattedMessage id="pages.searchTable.type"
                                 defaultMessage="用户类型" />,
        dataIndex: 'type',
        hideInForm: true,
        sorter: true,
        valueEnum: {
          2: {
            text: (
              <FormattedMessage
                id="pages.searchTable.nameStatus.supervisor"
                defaultMessage="部门主管"
              />
            ),
            type: 2,
          },
          1: {
            text: (
              <FormattedMessage id="pages.searchTable.nameStatus.admin"
                                defaultMessage="系统管理员" />
            ),
            type: 1,
          },
          3: {
            text: '普通成员',
            type: 3,
          },
          4: {
            text: '部门组长',
            type: 4,
          },
          0: {
            text: '其他成员',
            type: 0,
          },
        },
      },
      {
        title: "所属部门",
        dataIndex: 'category_id',
        // valueEnum: departmentList,
        valueType: 'select',
        request : async () => {
          console.log(departmentList)
          if (!departmentList.length) {
            const d = await departmentRequest();
            setDepartmentList(d);
            return d;
          } else {
            return departmentList;
          }

        },
      },
      {
        title: '活动次数',
        dataIndex: 'login_count',
        sorter: true,
        search: false,
      },
      {
        title: '创建时间',
        sorter: true,
        dataIndex: 'created_at',
        renderText: (text: number) => {
          return text * 1000;
        },
        valueType: 'dateTime',
        search: false,
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        search: false,
      },
      {
        title:
          <FormattedMessage id="pages.searchTable.titleOption"
                            defaultMessage="操作" />,
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
            <FormattedMessage id="pages.searchTable.update"
                              defaultMessage="修改" />
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
            <FormattedMessage id="pages.searchTable.new"
                              defaultMessage="新建" />
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
              <FormattedMessage id="pages.searchTable.chosen"
                                defaultMessage="已选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item"
                                defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
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
            <FormattedMessage id="pages.searchTable.batchDeletion"
                              defaultMessage="批量删除" />
          </Button>
          <Button type="primary">
            <FormattedMessage id="pages.searchTable.batchApproval"
                              defaultMessage="批量审批" />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="新建员工账号"
        width="400px"
        modalProps={{destroyOnClose: true}}
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
              message: '账号名为必填项！',
            },
          ]}
          width="md"
          name="username"
          label="账号名"
        />
        <ProFormText.Password
          rules={[
            {
              required: true,
              message: '密码为必填项！',
            },
          ]}
          label="密码"
          width="md"
          name="password"
        />
        <ProFormText.Password
          rules={[
            {
              required: true,
              message: '必填！',
            },
          ]}
          label="确认密码"
          width="md"
          name="confirm_password"
        />
        <ProFormSelect
          width="md"
          name="category_id"
          label="所属部门"
          // request={departmentRequest}
          options={
            departmentList
          }
        />
        <ProFormSelect
          width="md"
          name="type"
          label="员工类型"
          valueEnum={{
            2: '部门主管',
            3: '普通员工',
            4: '部门组长',
          }}
        />
        <ProFormTextArea width="md"
                         name="remark"
                         label="备注" />
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
        departmentList={departmentList}
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
