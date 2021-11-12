import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Drawer,
} from 'antd';
import MyComponent from '../../../components/Common/quill';
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
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect, ProFormUploadButton,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {
} from '@/services/ant-design-pro/api';
import {
  addProduct, products, removeProduct,
  updateProduct,
} from '@/services/ant-design-pro/frontend-product';
import {
  categoriesRequest,
  CustomImageUpload,
} from '@/components/Common';

// import Timestamp from '@/components/Timestamp';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.FrontendProduct) => {
  // 图片上传处理
  console.log(fields.images)
  if (fields.images)
    fields.images = fields.images.map((res) => {
      // @ts-ignore
      if (res.response) {
        // @ts-ignore
        return res.response.data.path;
      } else {
        return res;
      }
    })
  const hide = message.loading('正在添加');
  try {
    await addProduct({ ...fields });
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
  // 图片上传处理
  console.log(fields.images)
  if (fields.images)
  fields.images = fields.images.map((res) => {
    // @ts-ignore
    if (res.response) {
      // @ts-ignore
      return res.response.data.path;
    } else {
      return res;
    }
  })
  const hide = message.loading('正在配置');
  try {
    await updateProduct({ id: fields.id }, {
      ...fields
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
const handleRemove = async (selectedRows: API.FrontendProduct[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeProduct({
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

  /** state category list */
  const [categories, setCategories] = useState<any[]>([]);

  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.FrontendProduct>();
  const [selectedRowsState, setSelectedRows] = useState<API.FrontendProduct[]>([]);

  /** 富文本 ref */
  const richTextRef = useRef<{props: {value: string}}>();


  const columns: ProColumns<API.FrontendProduct>[] = [
    {
      title: '产品名',
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: 300,
      render: (dom, entity) => {
        return (
          <div>
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {entity.name}
            </a>
          </div>
        );
      },
    },
    {
      title: '产品类别',
      dataIndex: ['category_id'],
      valueType: 'select',
      request: async () => {
        if (!categories.length) {
          const d = await categoriesRequest();
          setCategories(d);
          return d;
        } else {
          return categories;
        }
      }
    },
    {
      title: '产品品牌',
      dataIndex: 'brand',
      search: false,
    },
    {
      title: '产地',
      dataIndex: 'origin_place',
      search: false,
    },
    {
      title: '证书',
      dataIndex: 'certification',
      search: false,
      hideInTable: true,
    },
    {
      title: '型号',
      dataIndex: 'model_number',
      search: false,
      hideInTable: true,
    },
    {
      title: '最小起订量',
      dataIndex: 'min_order_quantity',
      search: false,
      hideInTable: true,
    },{
      title: '价格',
      dataIndex: 'price',
      search: false,
    },
    {
      title: '包装细节',
      dataIndex: 'package_details',
      search: false,
    },
    {
      title: '配送时间',
      dataIndex: 'delivery_time',
      search: false,
      hideInTable: true,
    },
    {
      title: '支付相关',
      dataIndex: 'payment',
      search: false,
      hideInTable: true,
    },
    {
      title: '月供应量',
      dataIndex: 'supply_ability',
      search: false,
      hideInTable: true,
    },
    {
      title: '产品描述',
      dataIndex: 'description',
      search: false,
      hideInTable: true,
      render: (dom, entity) => {
        console.log(entity.description)
        return (<div dangerouslySetInnerHTML={{ __html: entity.description }}/>)
      },
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
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.FrontendProduct, API.PageParams>
        headerTitle="产品列表"
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
        ]}
        // request={orders}
        request={products}
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
        title="新建产品"
        width="600px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (value) => {
          if (richTextRef.current) {
            value = {...value, description: richTextRef.current.props.value}
          }
          const success = await handleAdd({...value} as API.FrontendProduct);
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
          label="产品名称"
          width="md"
          name="name"
        />
        <CustomImageUpload
          label="产品图片"
          width="md"
          name="image"
          multiple={true}
          listType='picture-card'
          action={'/index.php/api/file/uploading?access_token='.concat(
            localStorage.getItem('access_token') as string,
          ).concat('&key=image')}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
          options={categories}
          label="产品类别"
          name="category_id"
        />
        <ProForm.Item
          name='description'
          label='产品描述'
        >
          <MyComponent richTextRef={richTextRef}/>
        </ProForm.Item>
        <ProFormText label="产地"
                     width="md"
                     name="origin_place" />
        <ProFormText label="品牌"
                     width="md"
                     name="brand" />
        <ProFormText label="证书"
                     width="md"
                     name="certification" />
        <ProFormText label="型号"
                     width="md"
                     name="model_number" />
        <ProFormText label="最小起订量"
                     width="md"
                     name="min_order_quantity" />
        <ProFormText label="价格"
                     fieldProps={{value: "Negotiable"}}
                     width="md"
                     name="price" />
        <ProFormText label="包装细节"
                     width="md"
                     name="package_details" />
        <ProFormText label="配送/发货时间"
                     width="md"
                     name="delivery_time" />
        <ProFormText label="支付相关"
                     width="md"
                     name="payment" />

        <ProFormText label="月供应能力"
                     width="md"
                     name="supply_ability" />




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
          <ProDescriptions<API.FrontendProduct>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.FrontendProduct>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

// @ts-ignore
export default TableList;
// @ts-ignore
