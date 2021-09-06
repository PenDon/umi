// import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Drawer,
  Tag,
} from 'antd';
import React, { useState, useRef } from 'react';
// import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
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
  ProFormDatePicker,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {
  importExcel,
  orderBatch,
  addOrderBatch,
  updateOrderBatch,
  removeOrderBatch,
  batchFurtherStep,
  batchSubmit,
  batchCheck,

} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  processRequest, renderOrdersQuantity, renderTimeLine,
  stepRequest,
} from '@/components/Common';


/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.OrderBatch) => {
  const hide = message.loading('正在添加');
  try {
    await addOrderBatch({ ...fields });
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
  console.log(fields);
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
    await updateOrderBatch({ id: fields.id }, { process_id: fields.process_id });
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
 * 批量删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.OrderBatch[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeOrderBatch({
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

/**
 * 批量提交
 *
 * @param selectedRows
 * @param data
 */
const handleSubmit = async (selectedRows: API.OrderBatch[], data?: { save_path: any }) => {
  const hide = message.loading('正在处理');
  if (!selectedRows) return true;
  try {
    await batchSubmit({
      ids: selectedRows.map((row) => row.id).join(','),
      save_path: data?.save_path,
    });
    hide();
    message.success('成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('失败，请重试');
    return false;
  }
};

/**
 * 批量审核
 *
 * @param selectedRows
 */
const handleCheck = async (selectedRows: API.OrderBatch[]) => {
  const hide = message.loading('正在处理');
  if (!selectedRows) return true;
  try {
    await batchCheck({
      ids: selectedRows.map((row) => row.id).join(','),
    });
    hide();
    message.success('成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('失败，请重试');
    return false;
  }
};


/**
 * 批量安排下一步
 * @param selectedRows
 */
const handleFurtherStep = async (selectedRows: API.OrderBatch[]) => {
  const hide = message.loading('正在批量操作');
  if (!selectedRows) return true;
  try {
    await batchFurtherStep({
      ids: selectedRows.map((row) => row.id).join(','),
    });
    hide();
    message.success('操作成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('操作失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {

  /** processList */
  const [processList, setProcessList] = useState<object[]>([]);
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 导入Excel窗口的弹窗 */
  const [createExcelModalVisible, handleExcelModalVisible] = useState<boolean>(false);

  /** 安排下一步窗口的弹窗 */
  // const [createFurtherStepModalVisible,
  // handleFurtherStepModalVisible] =
  // useState<boolean>(false);

  /** 提交任务窗口的弹窗 */
  const [createTaskDoneModalVisible, handleTaskDoneModalVisible] = useState<boolean>(false);


  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.OrderBatch>();
  const [selectedRowsState, setSelectedRows] = useState<API.OrderBatch[]>([]);


  // @ts-ignore
  // @ts-ignore
  /** 国际化配置 */

  const columns: ProColumns<API.OrderBatch>[] = [
    {
      title: '序号',
      dataIndex: 'id',
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
      search: false,
    },
    {
      title: '名称',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: '存图路径',
      dataIndex: 'save_path',
      search: false,
    },
    {
      title: '单量',
      dataIndex: 'quantity',
      sorter: true,
      search: false,
    },
    {
      title: '处理流程',
      dataIndex: 'process_id',
      valueType: 'select',
      request: async () => {
        if (!processList.length) {
          const d = await processRequest();
          setProcessList(d);
          return d;
        } else {
          return processList;
        }

      },
    },
    {
      title: '进度',
      dataIndex: ['step', 'name'],
      renderText: (text: any, record) => {
        if (!text) {
          return <Tag color={'yellow'}>没有安排</Tag>;
        }
        // eslint-disable-next-line no-restricted-syntax
        const status = record.status;

        if (status !== undefined) {

          if (status == 3) {
            return <Tag color="green">已完成{text}</Tag>; //  审核通过
                                                       // =>
                                                       // 完成
          }

          if (status == 2) {
            return <Tag color="blue">审核{text}中</Tag>;
          }

          if (status == 1) {
            return <Tag color="cyan">{text}任务已接取</Tag>; // 任务已被接取
          }

          if (status == 0) {
            return <Tag color="red">{text}任务待接取</Tag>; //  安排了人
            // =>
            // 正在
          }
        }

        return '无';
      },
      renderFormItem: () => {
        return (
          <div>
            <ProFormSelect name="step_id"
                           params={{}}
                           request={stepRequest} />
            <ProFormSelect name="status"
                           options={[
                             {
                               value: 0,
                               label: '待接取',
                             },
                             {
                               value: 1,
                               label: '已接取',
                             },
                             {
                               value: 2,
                               label: '审核中',
                             },
                             {
                               value: 3,
                               label: '完成',
                             },
                           ]}
            />
          </div>
        );
      },
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
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return [
          <Button type={'link'}
                  href={`/#/manage/orders?batch_id=${record.id}`}
                  key={'redirect'}
          >跳转至订单详情</Button>,
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
  ];
  return (
    <PageContainer>
      <ProTable<API.OrderBatch, API.PageParams>
        headerTitle="订单列表"
        scroll={{ y: 500 }}
        footer={(data) => {
          return renderOrdersQuantity(data);
        }}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{ defaultPageSize: 10 }}
        toolBarRender={
          (action, rows) => {
            if (rows.selectedRows && rows.selectedRows.length !== 0) {
              return [
                <div>
                  <span style={{ marginRight: 10 }}>批量操作：</span>
                  <Button
                    // @ts-ignore
                    type="danger"
                    style={{
                      marginRight: 5,
                      display: '',
                    }}
                    onClick={async () => {
                      await handleRemove(selectedRowsState);
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    }}
                  >
                    删除
                  </Button>
                  <Button
                    // @ts-ignore
                    type="primary"
                    shape={'round'}
                    style={{
                      marginRight: 5,
                    }}
                    key="furtherStep"
                    onClick={async () => {
                      await handleFurtherStep(selectedRowsState);
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    }}
                  >
                    安排下一步
                  </Button>
                  <Button
                    // @ts-ignore
                    type="primary"
                    shape={'round'}
                    style={{
                      marginRight: 5,
                      // display: checkVisible,
                    }}
                    key="check"
                    onClick={async () => {
                      await handleCheck(selectedRowsState);
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    }}
                  >
                    审核通过
                  </Button>
                  <Button
                    type="primary"
                    key="primary"
                    onClick={() => {
                      handleExcelModalVisible(true);
                    }}
                  >
                    <PlusOutlined />
                    导入Excel
                  </Button>
                  ,
                </div>,
              ];
            }
            return [
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
            ];
          }

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
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleExcelModalVisible(true);
          //   }}
          // >
          //   <PlusOutlined />
          //   导入Excel
          // </Button>,
        }
        request={orderBatch}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
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
        <ProFormSelect
          label="处理流程"
          name="process_id"
          request={processRequest}
        />
        <ProFormUploadButton
          label="文件上传"
          width="md"
          name="file"
          rules={[{ required: true, message: '请上传文件！' }]}
          action={'/index.php/api/file/uploading?access_token='.concat(
            localStorage.getItem('access_token') as string,
          )}
          fieldProps={{ multiple: true }}
        />
      </ModalForm>
      {/*<ModalForm*/}
      {/*  title="安排下一步"*/}
      {/*  width="400px"*/}
      {/*  visible={createFurtherStepModalVisible}*/}
      {/*  onVisibleChange={handleFurtherStepModalVisible}*/}
      {/*  onFinish={async (value) => {*/}
      {/*    const success = await handleFurtherStep(selectedRowsState, value as { file: any });*/}
      {/*    setSelectedRows([]);*/}
      {/*    if (success) {*/}
      {/*      handleFurtherStepModalVisible(false);*/}
      {/*      if (actionRef.current) {*/}
      {/*        actionRef.current.reload();*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ProFormSelect*/}
      {/*    name="arranged_id"*/}
      {/*    label="下一步负责人"*/}
      {/*    request={memberList}*/}
      {/*    placeholder="请选择"*/}
      {/*    rules={[{ required: true, message: '请选择！' }]}*/}
      {/*  />*/}
      {/*</ModalForm>*/}
      <ModalForm
        title="提交任务"
        width="400px"
        visible={createTaskDoneModalVisible}
        onVisibleChange={handleTaskDoneModalVisible}
        onFinish={async (value: { save_path: string }) => {
          const success = await handleSubmit(selectedRowsState, value);
          setSelectedRows([]);
          if (success) {
            handleTaskDoneModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormDatePicker
          rules={[{ required: true }]}
          name="save_path"
          label="存图路径"
          fieldProps={{ format: 'MM-DD' }}
        />
      </ModalForm>
      <ModalForm
        title="新建订单"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.OrderBatch);
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
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        options={processList}
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
          <ProDescriptions<API.OrderBatch>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.OrderBatch>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
