import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'umi';
// import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect, ProFormUploadButton } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {
  addOrder,
  updateOrder,
  removeOrder,
  importExcel,
  orders,
} from '@/services/ant-design-pro/api';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.Order) => {
  const hide = message.loading('正在添加');
  try {
    await addOrder({ ...fields });
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
 * 导入Excel
 *
 * @param fields
 */
const handleImport = async (fields: { file: any }) => {
  const hide = message.loading('正在上传');
  try {
    await importExcel({ ...fields });
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
    await updateOrder({
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
const handleRemove = async (selectedRows: API.Order[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeOrder({
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
  /** 导入Excel窗口的弹窗 */
  const [createExcelModalVisible, handleExcelModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Order>();
  const [selectedRowsState, setSelectedRows] = useState<API.Order[]>([]);

  /** 国际化配置 */
  // const intl = useIntl();

  const columns: ProColumns<API.Order>[] = [
    {
      title: '订单号',
      dataIndex: 'order_number',
      sorter: true,
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
      title: '所属批次',
      dataIndex: 'batch_name',
    },
    // {
    //   title: '是否打面单',
    //   dataIndex: ['order', 'has_face_sheet'],
    //   valueEnum: {
    //     '': {
    //       text: '全部',
    //     },
    //     0: {
    //       text: '否',
    //     },
    //     1: {
    //       text: '是',
    //     },
    //   },
    //
    // },
    {
      title: '收货人姓名',
      dataIndex: 'consignee_name',
      hideInTable: true,
    },
    {
      title: '产品名称',
      dataIndex: 'product_name',
    },
    // {
    //   title: '补发性质',
    //   dataIndex: 'type',
    //   valueEnum: {
    //     '': {
    //       text: '全部',
    //     },
    //     0: {
    //       text: '补发性质一',
    //     },
    //     1: {
    //       text: '补发性质二',
    //     },
    //     2: {
    //       text: '补发性质三',
    //     },
    //     3: {
    //       text: '补发性质四',
    //     },
    //
    //   },
    // },
    {
      title: '产品规格',
      dataIndex: 'custom_info',
      search: false,

      //  处理换行
      render: (dom) => {
        return <span style={{ whiteSpace: 'pre-line' }}>{dom}</span>;
      },
    },
    {
      title: '产品数量',
      dataIndex: 'product_quantity',
      search: false,
    },
    {
      title: '下单时间',
      dataIndex: 'paid_at',
      renderText: (text: number) => {
        return text * 1000;
      },
      valueType: 'dateTime',
      search: false,
      sorter: true,
    },
    {
      title: '当前步骤',
      dataIndex: ['batch', 'stepDetails'],
      search: false,
      renderText: (details: any) => {
        if (!details.length) {
          return '没有安排';
        }
        // eslint-disable-next-line no-restricted-syntax
        const detail = details[0];
        if (detail.status !== 3) {
          if (detail.status === 2) {
            return `已完成${detail.stepName}`;
          }

          if (detail.status === 1) {
            return `正在${detail.stepName}`;
          }

          if (detail.status === 0) {
            return `待${detail.stepName}`;
          }
        }
        return '无';
      },
    },
    {
      title: '收货人国家',
      dataIndex: 'country',
      search: false,
      hideInTable: true,
    },
    {
      title: '买家Email',
      dataIndex: 'email',
      search: false,
      hideInTable: true,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      search: false,
      hideInTable: true,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      search: false,
      hideInTable: true,
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
      hideInTable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      // hideInTable: true,
    },
    {
      title: '步骤详情',
      dataIndex: ['batch', 'stepDetails'],
      search: false,
      hideInTable: true,
      renderText: (details: any) => {
        const detailColumns = [
          {
            title: '步骤名称',
            dataIndex: 'stepName',
          },
          {
            title: '状态',
            dataIndex: 'status',
            renderText: (text: number, record: { status: number; stepName: string }) => {
              if (text === 0) {
                return `待${record.stepName}`;
              }
              if (text === 1) {
                return `${record.stepName}中`;
              }
              if (text === 2) {
                return `已完成${record.stepName}`;
              }
              return '未知';
            },
          },
          {
            title: '安排时间',
            dataIndex: 'created_at',
            renderText: (text: number) => {
              return text * 1000;
            },
            valueType: 'dateTime',
          },
          {
            title: '安排人',
            dataIndex: 'creator',
          },
          {
            title: '被安排人',
            dataIndex: 'arranged',
          },
          {
            title: '完成时间',
            dataIndex: 'updated_at',
            renderText: (text: number, record: { status: number; stepName: string }) => {
              if (record.status === 2) {
                return text * 1000;
              }
              return null;
            },
            valueType: 'dateTime',
          },
          {
            title: '完成人',
            dataIndex: 'updater',
            renderText: (text: string, record: { status: number; stepName: string }) => {
              if (record.status === 2) {
                return text;
              }
              return null;
            },
          },
        ];
        return (
          <ProTable
            pagination={false}
            toolBarRender={false}
            search={false}
            columns={detailColumns}
            dataSource={details}
          />
        );
      },
    },
    // {
    //   title: '附加图片',
    //   dataIndex: 'image',
    //   search: false,
    //   renderText: (text) => {
    //     return (<img src={text}
    //                  width={50} />);
    //   },
    // },
  ];

  return (
    <PageContainer>
      <ProTable<API.Order, API.PageParams>
        headerTitle="订单列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{ defaultPageSize: 10 }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleModalVisible(true);
          //   }}
          // >
          //   <PlusOutlined />
          //   <FormattedMessage id="pages.searchTable.new"
          //                     defaultMessage="新建" />
          // </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleExcelModalVisible(true);
            }}
          >
            <PlusOutlined />
            导入Excel
          </Button>,
        ]}
        request={orders}
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
          {/* <Button type="primary"> */}
          {/*  <FormattedMessage id="pages.searchTable.batchApproval" */}
          {/*                    defaultMessage="批量审批" /> */}
          {/* </Button> */}
        </FooterToolbar>
      )}
      <ModalForm
        title="导入Excel"
        width="400px"
        visible={createExcelModalVisible}
        onVisibleChange={handleExcelModalVisible}
        onFinish={async (value) => {
          const success = await handleImport(value as { file: any });
          if (success) {
            handleExcelModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormUploadButton
          label="文件上传"
          width="md"
          name="file"
          action={'/api/file/uploading?access_token='.concat(
            localStorage.getItem('access_token') as string,
          )}
        />
      </ModalForm>
      <ModalForm
        title="新建订单"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.Order);
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
          label="订单号"
          width="md"
          name="order_id"
        />

        <ProFormSelect
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
          options={[
            {
              value: '0',
              label: '补发性质一',
            },
            {
              value: '1',
              label: '补发性质二',
            },
            {
              value: '2',
              label: '补发性质三',
            },
          ]}
          label="补发性质"
          name="type"
        />
        <ProFormText label="补发原因及其他备注" width="md" name="remark" />
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
          <ProDescriptions<API.Order>
            column={2}
            title={currentRow?.order_number}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Order>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
