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
  ProFormSelect,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import {
  orderBatch,
  batchSubmit,
} from '@/services/ant-design-pro/api';
import { renderOrdersQuantity } from '@/components/Common';


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

const TableList: React.FC = () => {

  /** 提交任务窗口的弹窗 */
  const [createTaskDoneModalVisible, handleTaskDoneModalVisible] = useState<boolean>(false);

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
                                                         //  =>
                                                         // 完成
            }

            if (status == 2) {
              return <Tag color="blue">审核{text}中</Tag>;
            }

            if (status == 1) {
              return <Tag color="blue">{text}任务已接取</Tag>;
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
      // {
      //   title: '附加图片',
      //   dataIndex: 'image',
      //   search: false,
      //   renderText: (text) => {
      //     return (<img src={text}
      //                  width={50} />);
      //   },
      // },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => {
          return [
            <Button type={'link'}
                    href={`/#/workspace/orders?batch_id=${record.id}`}
                    key={'redirect'}
            >跳转</Button>,
          ];
        },
      },
    ];

  return (
    <PageContainer>
      <ProTable<API.OrderBatch, API.PageParams>
        headerTitle="订单列表"
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
                    type="primary"
                    shape={'round'}
                    style={{ marginRight: 5 }}
                    key="submit"
                    onClick={async () => {
                      let needSavePath = true;
                      for (const batch of selectedRowsState) {
                        if (batch.step && batch.step.name == '画图') {

                        } else {
                          needSavePath = false;
                          break;
                        }
                      }
                      if (needSavePath) {
                        handleTaskDoneModalVisible(true);
                      } else {
                        await handleSubmit(selectedRowsState);
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                      }
                    }}
                  >
                    提交任务
                  </Button>

                </div>,
              ];
            }
            return [
            ];
          }

        }
        params={{ pick_up_member_id: localStorage.getItem("user_id")}}
        request={orderBatch}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

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
          fieldProps={{format: "MM-DD"}}
        />
      </ModalForm>


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
