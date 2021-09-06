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
  ProFormSelect,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { StatisticCard } from '@ant-design/pro-card';
import {
  orderBatch,
  removeOrderBatch,
  batchPickUp,
} from '@/services/ant-design-pro/api';

const { Operation } = StatisticCard;

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
 * 批量接取
 *
 * @param selectedRows
 */
const handlePickUp = async (selectedRows: API.OrderBatch[]) => {
  const hide = message.loading('正在处理');
  if (!selectedRows) return true;
  try {
    await batchPickUp({
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

function renderOrdersQuantity(data: readonly API.OrderBatch[]) {
  let sum = 0;
  for (const d of data) {
    if (d.quantity) {
      sum += d.quantity;
    }
  }
  return (
    <StatisticCard.Group>
      <StatisticCard
        statistic={{
          title: '总单量',
          value: sum,
        }}
      />
      <Operation>=</Operation>
      <StatisticCard
        statistic={{
          title: '散单',
          value: "xxx",
        }}
      />
      <Operation>+</Operation>
      <StatisticCard
        statistic={{
          title: 'XXX单',
          value: "xxx",
        }}
      />
      <Operation>+</Operation>
      <StatisticCard
        statistic={{
          title: 'YYY单',
          value: "xxx",
        }}
      />
    </StatisticCard.Group>
  );
}

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.OrderBatch>();
  const [selectedRowsState, setSelectedRows] = useState<API.OrderBatch[]>([]);

  const columns: ProColumns<API.OrderBatch>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      sorter: true,
      search: false,
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
      dataIndex: 'process',
      search: false,
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
            return <Tag color="cyan">{text}任务已接取</Tag>;
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
                      display: 'none',
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
                    type="primary"
                    shape={'round'}
                    style={{
                      marginRight: 5,
                    }}
                    key="pick-up"
                    onClick={async () => {
                      await handlePickUp(selectedRowsState);
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    }}
                  >
                    接取任务
                  </Button>
                  ,
                </div>,
              ];
            }
            return [];
          }
        }
        request={orderBatch}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
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
