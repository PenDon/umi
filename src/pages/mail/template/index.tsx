import {
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  message,
  Popover,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';
import {
  FooterToolbar,
  PageContainer,
} from '@ant-design/pro-layout';
import type {
  ActionType,
  ProColumns,
} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {
  addMailTemplate,
  checkEmail, listMailTemplate,
  mailTemplates,
  removeMailTemplate,
  updateMailTemplate,
} from '@/services/ant-design-pro/mail-template';
import { listMailAccount } from '@/services/ant-design-pro/mail-account';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.MailTemplate) => {
  const hide = message.loading('正在添加');
  try {
    await addMailTemplate({ ...fields });
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
 * 开启邮件检测
 *
 * @param fields
 */
const handleCheckEmail = async (fields: Record<string, any>) => {
  const hide = message.loading('正在执行');
  try {
    await checkEmail({ ...fields });
    hide();
    message.success('成功');
    return true;
  } catch (error) {
    hide();
    message.error('失败请重试！');
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
    await updateMailTemplate(
      { id: fields.id },
      {
        // name: fields.name,
        // remark: fields.remark,
        // keywords: fields.keywords,
        ...fields,
      },
    );
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
const handleRemove = async (selectedRows: API.MailTemplate[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeMailTemplate({
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
  /** 开启检测窗口的弹窗 */
  const [checkEmailModalVisible, handleCheckEmailModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.MailTemplate>();
  const [selectedRowsState, setSelectedRows] = useState<API.MailTemplate[]>([]);

  /** 国际化配置 */
    // const intl = useIntl();


  const columns: ProColumns<API.MailTemplate>[] = [
      {
        title: '模板名称',
        dataIndex: 'name',
        width: 140,
        render: (dom, entity) => {
          return (
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {dom}
            </a>
          );
        },
      },
      {
        title: '模板关键字',
        dataIndex: 'keywords',
        search: false,
        width: 400,
        renderText: (keywords: API.Keyword[]) => {
          return (
            <span>
            {keywords.map((keyword) => {
              return <Tag key={keyword.name}>{keyword.name}</Tag>;
            })}
          </span>
          );
        },
      },
      {
        title: '模板主题',
        dataIndex: 'subject',
        search: false,
      },
      {
        title: '模板内容',
        dataIndex: 'body',
        search: false,
        width: 500,
        renderText: (text: string) => {
          if (text.length > 100) {
            const content = (
              <div style={{ width: 500 }}>
                <p>{text}</p>
              </div>
            );
            return (
              <span>{text.slice(0, 100)}
                <Popover content={content}
                         trigger="click"
                         placement="bottom">
              <Button type='link'>{'...'}</Button>
              </Popover>
              </span>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        search: false,
      },
      {
        title: '创建日期',
        dataIndex: 'created_at',
        sorter: true,
        renderText: (text: number) => {
          return text * 1000;
        },
        valueType: 'dateTime',
        search: false,
      },

      {
        title: '备注',
        dataIndex: 'remark',
        search: false,
        hideInTable: true,
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => {
          return [
            <Button
              key="update"
              type="primary"
              onClick={() => {
                handleUpdateModalVisible(true);
                setCurrentRow(record);
              }}
            >
              修改
            </Button>,
          ];
        },
      },
    ];

  return (
    <PageContainer>
      <ProTable<API.MailTemplate, API.PageParams>
        headerTitle="模板列表"
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
            新建邮件模板
          </Button>,
          <Button
            type="primary"
            key="check"
            onClick={() => {
              handleCheckEmailModalVisible(true);
            }}
          >
            <PlayCircleOutlined />
            开启检测
          </Button>,
        ]}
        request={mailTemplates}
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
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项 &nbsp;&nbsp;
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
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="新建模板"
        modalProps={{
          destroyOnClose: true,
        }}
        width="640px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.MailTemplate);
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
              message: '必填项',
            },
          ]}
          label="模板名称"
          width="md"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
          label="模板主题"
          width="md"
          name="subject"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
          label="模板内容"
          width="md"
          name="body"
        />
        <ProFormText name="remark"
                     label="备注" />
        <ProFormList name="keywords"
                     label="模板关键词">
          <ProFormGroup>
            <ProFormText
              rules={[
                {
                  required: true,
                },
              ]}
              name="name"
              label="关键词"
            />
          </ProFormGroup>
        </ProFormList>
      </ModalForm>
      <ModalForm
        title="开启邮件检测"
        // modalProps={{
        //   destroyOnClose: true,
        // }}
        width="640px"
        visible={checkEmailModalVisible}
        onVisibleChange={handleCheckEmailModalVisible}
        onFinish={async (value) => {
          const success = await handleCheckEmail(value);
          if (success) {
            handleCheckEmailModalVisible(false);
            // 重载表格数据
            // if (actionRef.current) {
            //   actionRef.current.reload();
            // }
          }
        }}
      >
        <ProFormSelect
          mode="multiple"
          name='addresser_ids'
          label='请选择邮箱账户'
          allowClear
          request={async () => {
            const response = await listMailAccount();
            if (response.data) {
              return response.data.items.map((account: API.MailAccount) => {
                return {
                  'label': account.account,
                  'value': account.id,
                };
              });
            }
            return [];
          }}
        />
        <ProFormSelect
          mode="multiple"
          name='template_ids'
          label='请选择邮件模板'
          allowClear
          request={async () => {
            const response = await listMailTemplate();
            if (response.data) {
              return response.data.items.map((template: API.MailTemplate) => {
                return {
                  'label': template.name,
                  'value': template.id,
                };
              });
            }
            return [];
          }}
        />

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
        {currentRow?.id && (
          <ProDescriptions<API.Process>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Process>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
