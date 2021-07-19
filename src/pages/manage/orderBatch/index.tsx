// import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Timeline, Tag } from 'antd';
import React, { useState, useRef } from 'react';
// import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect, ProFormUploadButton } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { StatisticCard } from '@ant-design/pro-card';
import {
  importExcel,
  orderBatch,
  addOrderBatch,
  updateOrderBatch,
  removeOrderBatch,
  batchFurtherStep,
  batchPickUp,
  batchCheck,
  members,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
const { Operation } = StatisticCard;

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
 * 员工列表
 *
 */
const memberList = async () => {
  try {
    const response = await members({}, {});
    if (response.data) {
      return response.data.map((value: API.MemberListItem) => {
        return { label: `${value.username}-${value.type_formatted}`, value: value.id };
      });
    }
    return [] ;
  } catch (error) {
    return [];
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
    await updateOrderBatch({
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

function renderTimeLine(row: API.OrderBatch | undefined) {
  if (row?.stepDetails && row.stepDetails.length !== 0) {
    const details = row.stepDetails;

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
            <Timeline.Item key={detail.id} label={detail.created_at}>
              {name}
              {detail.name} By <Tag color={'blue'} key={'username'}>{detail.username}</Tag> To {
                detail.type == 0 && (<Tag color={'blue'} key={'arranged'}>{row.arranged}</Tag>)
            }
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  }
  return '-';
}

function renderOrdersQuantity(data: readonly API.OrderBatch[]) {
  let sum = 0
  for (const d of data) {
    if (d.quantity) {
      sum += d.quantity
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
          value: 234,
        }}
      />
      <Operation>+</Operation>
      <StatisticCard
        statistic={{
          title: 'XXX单',
          value: 112,
        }}
      />
      <Operation>+</Operation>
      <StatisticCard
        statistic={{
          title: 'YYY单',
          value: 255,
        }}
      />
    </StatisticCard.Group>
  );
}

/**
 * 批量安排下一步
 * @param selectedRows
 * @param fields
 */
const handleFurtherStep = async (selectedRows: API.OrderBatch[], fields: any) => {
  const hide = message.loading('正在批量操作');
  if (!selectedRows) return true;
  try {
    await batchFurtherStep({
      ids: selectedRows.map((row) => row.id).join(','),
      ...fields,
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
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 导入Excel窗口的弹窗 */
  const [createExcelModalVisible, handleExcelModalVisible] = useState<boolean>(false);

  /** 安排下一步窗口的弹窗 */
  const [createFurtherStepModalVisible, handleFurtherStepModalVisible] = useState<boolean>(false);

  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.OrderBatch>();
  const [selectedRowsState, setSelectedRows] = useState<API.OrderBatch[]>([]);


  // @ts-ignore
  // @ts-ignore
  /** 国际化配置 */
  // const intl = useIntl();

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
    },
    {
      title: '名称',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: '单量',
      dataIndex: 'quantity',
      sorter: true,
    },
    {
      title: '处理流程',
      dataIndex: 'process',
    },
    {
      title: '步骤',
      dataIndex: ['step', 'name'],
      search: false,
      renderText: (text: any, record) => {
        if (!text) {
          return <Tag color={'yellow'}>没有安排</Tag>;
        }
        // eslint-disable-next-line no-restricted-syntax
        const status = record.status;

        if (status !== undefined) {

          if (status == 2) {
            return <Tag color="green">已完成{text}</Tag>; //  审核通过  => 完成
          }

          if (status == 1) {
            return <Tag color="blue">审核{text}中</Tag>;
          }

          if (status == 0) {
            return <Tag color="red">正在{text}</Tag>; //  安排了人 => 正在
          }
        }

        return '无';
      },
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
          href={`/#/manage/orders?batch_id=${record.id}`}
                  key={'redirect'}
          >跳转</Button>
        ]
      }
    }
    //     // stepDetails[len - 1]: 最新的一条步骤记录
    //
    //     // 下一步按钮是否可点击: 没有安排 或者 最新记录是已完成状态
    //     let furtherStepDisabled = true;
    //     const len = record.stepDetails.length;
    //     if (
    //       record.stepDetails &&
    //       (len === 0 || record.stepDetails[len - 1].type === 2)
    //     ) {
    //       furtherStepDisabled = false;
    //     }
    //
    //     // // 接取任务按钮是否可点击： 最新记录是待接取任务状态
    //     // let pickUpDisabled = true;
    //     // if (len !== 0 && record.stepDetails[len -
    //     // 1].type === 0) { pickUpDisabled = false; }  //
    //     // 提交任务按钮是否可点击： 最新记录是已接取任务状态 let submitDisabled =
    //     // true; if (len !== 0 && record.stepDetails[len
    //     // - 1].type === 1) { submitDisabled = false; }
    //
    //     return [
    //       <Button
    //         disabled={furtherStepDisabled}
    //         key="furtherStep"
    //         type="primary"
    //         onClick={handleFurtherStepClick}
    //       >
    //         安排下一步
    //       </Button>,
    //       // <Button
    //       //   disabled={pickUpDisabled}
    //       //   key="pickUp"
    //       //   type="primary"
    //       //   onClick={handleFurtherStepClick}
    //       // >
    //       //   接取任务
    //       // </Button>,
    //       // <Button
    //       //   disabled={submitDisabled}
    //       //   key="submit"
    //       //   type="primary"
    //       //   onClick={handleFurtherStepClick}
    //       // >
    //       //   提交任务
    //       // </Button>,
    //     ];
    //
    //     // [
    //     // <button disabled={true}
    //     //
    //     //         key="config"
    //     //         onClick={() => {
    //     //           handleUpdateModalVisible(true);
    //     //           setCurrentRow(record);
    //     //         }}
    //     // >
    //     //   安排下一步进行的时间
    //     //
    //     // </button>,
    //     //
    //     // ],
    //   },
    // },
  ];

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <PageContainer>
      <ProTable<API.OrderBatch, API.PageParams>
        headerTitle="订单列表"
        footer={(data) => {return renderOrdersQuantity(data)}}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{ defaultPageSize: 10 }}
        toolBarRender={
          (action, rows) => {
            if (rows.selectedRows && rows.selectedRows.length !== 0) {
              // @ts-ignore
              // eslint-disable-next-line eqeqeq
              const furtherStepVisible = localStorage.getItem('user_type') == '1' ? '' : 'none';
              const checkVisible = localStorage.getItem('user_type') == '1' ? '' : 'none';
              // const pickUpVisible = localStorage.getItem('user_type') == '1' ? '' : 'none'
              return [
                <div>
                  <span style={{ marginRight: 10 }}>批量操作：</span>
                  <Button
                    // @ts-ignore
                    type="danger"
                    style={{ marginRight: 5, display: 'none' }}
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
                    style={{ marginRight: 5, display: furtherStepVisible }}
                    key="furtherStep"
                    onClick={async () => {
                      // await handleFurtherStepClick(selectedRowsState);
                      // setSelectedRows([]);
                      // actionRef.current?.reloadAndRest?.();
                      handleFurtherStepModalVisible(true);
                    }}
                  >
                    安排下一步
                  </Button>
                  <Button
                    // @ts-ignore
                    type="primary"
                    shape={'round'}
                    style={{ marginRight: 5 }}
                    key="pick-up"
                    onClick={async () => {
                      await handlePickUp(selectedRowsState);
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    }}
                  >
                    提交任务
                  </Button>
                  <Button
                    // @ts-ignore
                    type="primary"
                    shape={'round'}
                    style={{ marginRight: 5, display: checkVisible }}
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
      {/* {selectedRowsState?.length > 0 && ( */}
      {/*  <FooterToolbar */}
      {/*    extra={ */}
      {/*      <div> */}
      {/*        <FormattedMessage id="pages.searchTable.chosen" */}
      {/*                          defaultMessage="已选择" />{' '} */}
      {/*        <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '} */}
      {/*        <FormattedMessage id="pages.searchTable.item" */}
      {/*                          defaultMessage="项" /> */}
      {/*        &nbsp;&nbsp; */}
      {/*      </div> */}
      {/*    } */}
      {/*  > */}
      {/*    <Button */}
      {/*      onClick={async () => { */}
      {/*        await handleRemove(selectedRowsState); */}
      {/*        setSelectedRows([]); */}
      {/*        actionRef.current?.reloadAndRest?.(); */}
      {/*      }} */}
      {/*    > */}
      {/*      <FormattedMessage id="pages.searchTable.batchDeletion" */}
      {/*                        defaultMessage="批量删除" /> */}
      {/*    </Button> */}
      {/*  </FooterToolbar> */}
      {/* )} */}
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
          fieldProps={{multiple: true}}
        />
      </ModalForm>
      <ModalForm
        title="安排下一步"
        width="400px"
        visible={createFurtherStepModalVisible}
        onVisibleChange={handleFurtherStepModalVisible}
        onFinish={async (value) => {
          const success = await handleFurtherStep(selectedRowsState, value as { file: any });
          setSelectedRows([]);
          if (success) {
            handleFurtherStepModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormSelect
          name="arranged_id"
          label="下一步负责人"
          request={memberList}
          placeholder="请选择"
          rules={[{ required: true, message: '请选择！' }]}
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
