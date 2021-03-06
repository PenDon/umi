import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Drawer,
  Tag, Image,
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
  ProFormSelect, ProFormUploadButton,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
// import type { FormValueType } from './components/UpdateForm';
// import UpdateForm from './components/UpdateForm';
import {
  reissueOrders,
  addReissueOrder, removeReissueOrder, reissueOrderToExcel,
} from '@/services/ant-design-pro/api';
// import Timestamp from '@/components/Timestamp';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.ReissueOrderItem) => {
  const hide = message.loading('正在添加');
  try {
    // @ts-ignore
    fields.image = fields.image[0].response.data.path;
    await addReissueOrder({ ...fields });
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
// const handleImport = async (fields: { file: any }) => {
//   const hide = message.loading('正在上传');
//   try {
//     await importExcel({ ...fields });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };

/**
 * 更新节点
 *
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('正在配置');
//   try {
//     await updateReissueOrder({ id: fields.id }, {
//       custom_info: fields.custom_info,
//     });
//     hide();
//
//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.ReissueOrderItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeReissueOrder({
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

const handleToExcel = async (selectedRows: API.ReissueOrderItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await reissueOrderToExcel({
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

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // /** 导入Excel窗口的弹窗 */
  // const [createExcelModalVisible,
  // handleExcelModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Order>();
  const [selectedRowsState, setSelectedRows] = useState<API.Order[]>([]);

  const columns: ProColumns<API.ReissueOrderItem>[] = [
    {
      title: '订单号',
      dataIndex: 'order_number',
      sorter: true,
      fixed: 'left',
      width: 140,
      render: (dom, entity) => {
        const order_number = entity.order_number ? entity.order_number : entity.order?.order_number;
        return (
          <div>
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {order_number}
            </a>
            <Tag color={'red'}>补发</Tag>
          </div>
        );
      },
    },
    {
      title: '补发性质',
      dataIndex: 'type_formatted',
      renderFormItem: () => {
        return (<ProFormSelect
          options={[
            {
              value: '1',
              label: '补发性质一',
            },
            {
              value: '2',
              label: '补发性质二',
            },
            {
              value: '3',
              label: '补发性质三',
            },
          ]}
          name="type"
        />)
      },
    },
    {
      title: '备注人',
      dataIndex: 'creator',
      search: false,
      // hideInTable: true,
    },
    {
      title: '备注日期',
      dataIndex: 'created_at',
      sorter: true,
      renderText: (text: number) => {
        return text * 1000;
      },
      valueType: 'dateTime',
      search: false,
      // hideInTable: true,
    },
    {
      title: '附加图片',
      dataIndex: 'image',
      search: false,
      renderText: (text) => {
        return (<Image src={text}
                     width={50}  alt={''}/>);
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      // hideInTable: true,
    },


    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => {
    //     return [
    //       <Button type={'link'}
    //               key={'update'}
    //               onClick={() => {
    //                 handleUpdateModalVisible(true);
    //                 setCurrentRow(record);
    //               }}
    //       >编辑</Button>,
    //     ];
    //   },
    // }
  ];

  return (
    <PageContainer>
      <ProTable<API.ReissueOrderItem, API.PageParams>
        headerTitle="订单列表"
        scroll={{ x: 1500 }}
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
            新建
          </Button>,
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
        ]}
        // request={orders}
        request={reissueOrders}
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

           <a type="primary" target='_blank'
            onClick={async () => {
              await handleToExcel(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
           >
            导出
           </a>
        </FooterToolbar>
      )}
      {/*<ModalForm*/}
      {/*  title="导入Excel"*/}
      {/*  width="400px"*/}
      {/*  visible={createExcelModalVisible}*/}
      {/*  onVisibleChange={handleExcelModalVisible}*/}
      {/*  onFinish={async (value) => {*/}
      {/*    const success = await handleImport(value as { file: any });*/}
      {/*    if (success) {*/}
      {/*      handleExcelModalVisible(false);*/}
      {/*      if (actionRef.current) {*/}
      {/*        actionRef.current.reload();*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ProFormUploadButton*/}
      {/*    label="文件上传"*/}
      {/*    width="md"*/}
      {/*    name="file"*/}
      {/*    action={'/index.php/api/file/uploading?access_token='.concat(*/}
      {/*      localStorage.getItem('access_token') as string,*/}
      {/*    )}*/}
      {/*    fieldProps={{ multiple: true }}*/}
      {/*  />*/}
      {/*</ModalForm>*/}
      <ModalForm
        title="新建补发订单"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.ReissueOrderItem);
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
          name="order_number"
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
              value: '1',
              label: '补发性质一',
            },
            {
              value: '2',
              label: '补发性质二',
            },
            {
              value: '3',
              label: '补发性质三',
            },
          ]}
          label="补发性质"
          name="type"
        />
        <ProFormText label="补发原因及其他备注"
                     width="md"
                     name="remark" />
          <ProFormUploadButton
            label="附加图片"
            width="md"
            name="image"
            action={'/index.php/api/file/uploading?access_token='.concat(
              localStorage.getItem('access_token') as string,
            ).concat('&key=image')}
            // fieldProps={{ multiple: true }}
          />
      </ModalForm>
      {/*<UpdateForm*/}
      {/*  onSubmit={async (value) => {*/}
      {/*    const success = await handleUpdate(value);*/}
      {/*    if (success) {*/}
      {/*      handleUpdateModalVisible(false);*/}
      {/*      setCurrentRow(undefined);*/}
      {/*      if (actionRef.current) {*/}
      {/*        actionRef.current.reload();*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  onCancel={() => {*/}
      {/*    handleUpdateModalVisible(false);*/}
      {/*    setCurrentRow(undefined);*/}
      {/*  }}*/}
      {/*  updateModalVisible={updateModalVisible}*/}
      {/*  values={currentRow || {}}*/}
      {/*/>*/}

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
            columns={columns as ProDescriptionsItemProps<API.ReissueOrderItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

// @ts-ignore
export default TableList;
// @ts-ignore
