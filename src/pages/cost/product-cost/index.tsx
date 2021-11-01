import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Drawer,
  Image,
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
  ProFormUploadButton,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import {
  addProductCost, productCost, removeProductCost,
  updateProductCost,
} from '@/services/ant-design-pro/product-cost';
import { FormValueType } from '@/pages/cost/product-cost/components/UpdateForm';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.ProductCost) => {
  const hide = message.loading('正在添加');
  try {
    // @ts-ignore
    fields.image = fields.image[0].response.data.thumbnail.path;
    await addProductCost({ ...fields });
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
    // @ts-ignore
    fields.image = fields.image[0].response.data.thumbnail.path;
    await updateProductCost({ id: fields.id }, {...fields
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
const handleRemove = async (selectedRows: API.ProductCost[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeProductCost({
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
  const [currentRow, setCurrentRow] = useState<API.ProductCost>();
  const [selectedRowsState, setSelectedRows] = useState<API.ProductCost[]>([]);

  const columns: ProColumns<API.ProductCost>[] = [
    {
      title: '平台SKU',
      dataIndex: 'sku',
      sorter: true,
      fixed: 'left',
      width: 140,
      render: (dom, entity) => {
        const sku = entity.sku
        return (
          <div>
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {sku}
            </a>
          </div>
        );
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      search: false,
      renderText: (text: string) => {
        const src = text.replace('_thumb', '')
        return (<Image src={text}
                       width={100}  alt={''}
                       preview={{
                         src: src,
                       }}
        />);
      },
    },
    {
      title: '材质',
      dataIndex: 'material',
      search: false,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      search: false,
    },
    {
      title: '规格',
      dataIndex: 'standards',
      search: false,
    },
    {
      title: '独立站价格(生产成本)',
      dataIndex: 'cost',
      search: false,
    },
    {
      title: '如加珠子/片单价',
      dataIndex: 'bead_cost',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      // hideInTable: true,
    },
    {
      title: '更新人',
      dataIndex: 'creator',
      search: false,
      // hideInTable: true,
    },
    {
      title: '更新时间',
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
          >修改</Button>,
        ];
      },
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.ProductCost, API.PageParams>
        headerTitle="产品报价表"
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
            新建产品报价
          </Button>,
        ]}
        // request={orders}
        request={productCost}
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
        </FooterToolbar>
      )}
      <ModalForm
        title="新建产品报价表"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.ProductCost);
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
          label="平台SKU"
          width="md"
          name="sku"
        />
        <ProFormUploadButton
          label="图片"
          width="md"
          name="image"
          action={'/index.php/api/file/uploading?access_token='.concat(
            localStorage.getItem('access_token') as string,
          ).concat('&key=image')}
          fieldProps={{data: {'key': 'image', 'generate_thumbnail': 1, 'thumbnail_size': '100x100'}}}
        />
        <ProFormText label="材质"
                     width="md"
                     name="material" />
        <ProFormText label="颜色"
                     width="md"
                     name="color" />
        <ProFormText label="规格"
                     width="md"
                     name="standards" />
        <ProFormText label="独立站成本(生产成本)"
                     width="md"
                     name="cost" />
        <ProFormText label="如加珠子/片单价"
                     width="md"
                     name="bead_cost" />
        <ProFormText label="备注"
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
            title={currentRow?.sku}
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

export default TableList;
