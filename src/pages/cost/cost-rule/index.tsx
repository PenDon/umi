import {
  CheckOutlined, CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
// import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormList,
  ProFormGroup,
  ProFormSelect, ProFormUploadButton,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from '@/pages/cost/cost-rule/components/UpdateForm';
import {
  addCostRule, costRules, importExcel, removeCostRule,
  updateCostRule,
} from '@/services/ant-design-pro/cost-rules';


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
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.CostRule) => {
  const hide = message.loading('正在添加');
  try {
    await addCostRule({ ...fields });
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
    await updateCostRule(
      { id: fields.id },
      {
        sku: fields.sku,
        bead_price: fields.bead_price,
        initial_price: fields.initial_price,
        has_beads: fields.has_beads,
        flag: fields.flag,
        remark: fields.remark,
        ruleValues: fields.ruleValues,
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
const handleRemove = async (selectedRows: API.CostRule[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeCostRule({
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

  /** 导入Excel窗口的弹窗 */
  const [createExcelModalVisible, handleExcelModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 是否带珠子 */
  const [hasBeads, setHasBeads] = useState<boolean>(true);

  /** 是否区分珠子颜色 */
  const [flag, setFlag] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CostRule>();
  const [selectedRowsState, setSelectedRows] = useState<API.CostRule[]>([]);

  // @ts-ignore
  /** 国际化配置 */
  // const intl = useIntl();


  const columns: ProColumns<API.CostRule>[] = [
    {
      title: 'SKU',
      dataIndex: 'sku',
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
      title: 'SKU额外选项',
      dataIndex: 'ruleValue',
      search: false,
      renderText: (ruleValues: API.CostRuleValue[]) => {
        if (ruleValues.length) {

          let text = ruleValues.map(value => {
            return (<div key={value.id}>
              <span>【{value.keyword}】 成本增加 {value.extra_cost}</span>
                {value.bead_price != 0 && <span>【{value.keyword}珠子/桃心】 单价 {value.bead_price}</span>}
              </div>
            )
          });
          return (<div>
            {text}
          </div>);
        }
        return "暂无数据";
      },
    },
      {
        title: '初始价格',
        dataIndex: 'initial_price',
        search: false,
      },
      {
        title: '是否带珠子/桃心',
        dataIndex: 'has_beads',
        search: false,
        renderText: text => {
          if (text) {
            return <CheckOutlined />
          } else {
            return <CloseOutlined />
          }
        }
      },
      {
        title: '珠子单价(不区分颜色)',
        dataIndex: 'bead_price',
        search: false,
        // hideInTable: true,
        //ts-ignore
        renderText: (text) => {
          if (text == 0) {
            return '无';
          }
          return text;
        },
      },
      {
        title: '是否区分珠子颜色',
        dataIndex: 'flag',
        search: false,
        renderText: text => {
          if (text) {
            return <CheckOutlined />
          } else {
            return <CloseOutlined />
          }
        }
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
      <ProTable<API.CostRule, API.PageParams>
        headerTitle="成本规则列表"
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
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleExcelModalVisible(true);
            }}
          >
            上传Excel
          </Button>,
        ]}
        request={costRules}
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
          {/* <Button type="primary"> */}
          {/*  <FormattedMessage id="pages.searchTable.batchApproval" */}
          {/*                    defaultMessage="批量审批" /> */}
          {/* </Button> */}
        </FooterToolbar>
      )}
      <ModalForm
        title="上传Excel"
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
        title="新建成本规则"
        width="640px"
        visible={createModalVisible}
        modalProps={{
          destroyOnClose: true,
        }}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.CostRule);
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
          label="SKU(用于关键字检索)"
          width="md"
          name="sku"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
          label="初始价格"
          width="md"
          name="initial_price"
        />
        <ProFormSelect
          name="has_beads"
          label="是否带珠子"
          valueEnum={{
            1: '是',
            0: '否',
          }}
          placeholder="请选择"
          fieldProps={{
            onChange: value => {
              if (value == 0) {
                setHasBeads(false);
              } else {
                setHasBeads(true);
              }
            }
          }}
        />
        <ProFormSelect
          name="flag"
          hidden={!hasBeads}
          label="是否区分珠子颜色"
          valueEnum={{
            1: '是',
            0: '否',
          }}
          placeholder="请选择"
          fieldProps={{
            onChange: value => {
              if (value == 1) {
                setFlag(true);
              } else {
                setFlag(false);
              }
            }
          }}
        />
        <ProFormText
          hidden={!hasBeads || flag}
          label="珠子单价(不区分珠子颜色)"
          width="md"
          name="bead_price"
        />

        <ProFormList name="ruleValues" label="额外选项成本">
          <ProFormGroup>
            <ProFormText
              rules={[
                {
                  required: true,
                },
              ]}
              name="keyword"
              label="选项关键字"
              placeholder="请输入选项关键字！"
            />
            <ProFormText
              rules={[
                {
                  required: true,
                },
              ]}
              name="extra_cost"
              label="该选项额外成本"
              placeholder="请输入该选项额外成本！"
            />
            <ProFormText
              name="bead_price"
              hidden={!hasBeads || !flag}
              label="珠子单价(区分颜色)"
              placeholder="请输入珠子单价(区分颜色)！"
            />
          </ProFormGroup>
        </ProFormList>

        <ProFormText label="备注" width="md" name="remark" />
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
          <ProDescriptions<API.CostRule>
            column={2}
            title={currentRow?.sku}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.CostRule>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
