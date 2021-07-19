import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Drawer,
  Timeline,
  Tag, Modal, List,
} from 'antd';
import React, { useState, useRef } from 'react';
// @ts-ignore
import { FormattedMessage } from 'umi';
// import { useIntl, FormattedMessage } from 'umi';
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
  ProFormText,
  ProFormSelect,
  ProFormUploadButton,
} from '@ant-design/pro-form';
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
  stepList,
} from '@/services/ant-design-pro/api';
import {
  // Link,
  useParams,
} from 'react-router-dom';
import Timestamp from '@/components/Timestamp';

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
  console.log(fields);
  try {
    await updateOrder({ id: fields.id }, {
      custom_info: fields.custom_info,
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

function renderTimeLine(row: API.Order | undefined) {
  if (row?.batch && row.batch.stepDetails.length !== 0) {
    const details = row.batch.stepDetails;

    return (
      <Timeline mode="left">
        {details.map((detail: any) => {
          let name = '';
          if (detail.type == 0) {
            name = '安排';
          } else {
            name = detail.type == 1 ? '提交' : '完成';
          }
          return (
            <Timeline.Item key={detail.id}
                           label={detail.created_at}>
              {name}
              {detail.name} By {detail.username}
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  }
  return '-';
}

function renderListDescription(item: API.OrderOperation) {
  return (
    <List.Item>
      <List.Item.Meta
        title={<span>{item.type}</span>}
        description={(
          <div>
                        <span>
                          By {item.creator}
                        </span>
            {item.created_at && (
              <Timestamp timestamp={item.created_at} />)}

          </div>
        )}
      />
    </List.Item>
  );
}

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 导入Excel窗口的弹窗 */
  const [createExcelModalVisible, handleExcelModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [recordVisible, handleRecordVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Order>();
  const [selectedRowsState, setSelectedRows] = useState<API.Order[]>([]);

  const stepRequest = async () => {
    const response = await stepList();

    return response.data;
  };

  // @ts-ignore
  const { id } = useParams();

  /** 国际化配置 */
    // const intl = useIntl();

  const columns: ProColumns<API.Order>[] = [
      {
        title: '订单号',
        dataIndex: 'order_number',
        sorter: true,
        fixed: 'left',
        width: 140,
        render: (dom, entity) => {
          return (
            <div>
              <a
                onClick={() => {
                  setCurrentRow(entity);
                  setShowDetail(true);
                }}
              >
                {dom}
              </a>
              {entity.is_custom_info_modified &&
              <Tag color={'red'}>定制信息已修改！</Tag>}
            </div>
          );
        },
      },
      {
        title: '所属批次',
        dataIndex: 'batch_name',
        fixed: 'left',
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
        //  处理换行
        render: (dom) => {
          return <span style={{ whiteSpace: 'pre-line' }}>{dom}</span>;
        },
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
        dataIndex: ['batch', 'step', 'name'],
        renderText: (text: any, record) => {
          if (!text) {
            return <Tag color={'yellow'}>没有安排</Tag>;
          }
          const batch = record.batch;
          if (batch) {
            if (batch.status === 2) {
              return <Tag color="green">已完成{text}</Tag>;
            }

            if (batch.status === 1) {
              return <Tag color="blue">审核{text}中</Tag>;
            }

            if (batch.status === 0) {
              return <Tag color="red">正在{text}</Tag>;
              ;
            }
          }
          return '无';
        },
        renderFormItem: () => {
          return (
            <div>
              <ProFormSelect name="step"
                             params={{}}
                             request={stepRequest} />
              <ProFormSelect name="status"
                             options={[
                               {
                                 value: 0,
                                 label: '正在进行',
                               },
                               {
                                 value: 1,
                                 label: '审核中',
                               },
                               {
                                 value: 2,
                                 label: '完成',
                               },
                             ]}
              />
            </div>
          );
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
        title: '操作记录',
        dataIndex: 'operations',
        search: false,
        width: 150,
        hideInDescriptions: true,
        // hideInTable: true,
        renderText: (operations: API.OrderOperation[], order) => {
          if (!operations || !operations.length) {
            return '无';
          } else {
            return (

              <Button key={'view-more'}
                      type={'primary'}
                      onClick={() => {
                        handleRecordVisible(true);
                        setCurrentRow(order);
                      }}
              >
                查看
              </Button>
            );
          }
        },
      },
      {
        title: '修改定制信息',
        hideInForm: true,
        hideInDescriptions: true,
        hideInTable: true,
        renderFormItem: () => {
          return (
            <ProFormSelect
              name={'has_custom_info_modified'}
              options={[
                {
                  'value': 0,
                  'label': '否',
                },
                {
                  'value': 1,
                  'label': '是',
                }
              ]}
            >

            </ProFormSelect>
          )
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        search: false,
        // hideInTable: true,
      },


      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => {
          return [
            <Button type={'link'}
                    key={'update'}
                    onClick={() => {
                      handleUpdateModalVisible(true);
                      setCurrentRow(record);
                    }}
            >编辑</Button>,
          ];
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
        scroll={{ x: 1500 }}
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
        // request={orders}
        request={(params,
                  sort,
                  filter) => {
          return orders({
            ...params,
            batch_id: id,
          }, { ...sort }, { ...filter });
        }
        }
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
          {/* <Button type="primary"> */}
          {/*  <FormattedMessage id="pages.searchTable.batchApproval" */}
          {/*                    defaultMessage="批量审批" /> */}
          {/* </Button> */}
        </FooterToolbar>
      )}
      <Modal
        footer={null}
        visible={recordVisible}
        onCancel={() => {
          setCurrentRow(undefined);
          handleRecordVisible(false);
        }}
      >
        <List
          dataSource={currentRow?.operations}
          renderItem={(item: API.OrderOperation) => {
            return renderListDescription(item);
          }}
          rowKey={'id'}
        />

      </Modal>
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
          action={'/index.php/api/file/uploading?access_token='.concat(
            localStorage.getItem('access_token') as string,
          )}
          fieldProps={{ multiple: true }}
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
        <ProFormText label="补发原因及其他备注"
                     width="md"
                     name="remark" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          console.log(value);
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
        footer={renderTimeLine(currentRow)}
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

// @ts-ignore
export default TableList;
