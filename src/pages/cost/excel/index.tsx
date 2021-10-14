import React, { useState, useRef } from 'react';
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
import { costExcels } from '@/services/ant-design-pro/api';


const TableList: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.CostExcel[]>([]);

  /** 国际化配置 */
    // const intl = useIntl();


  const columns: ProColumns<API.CostExcel>[] = [
      {
        title: '序号',
        dataIndex: 'id',
        search: false,
      },
      {
        title: '文件名',
        dataIndex: 'filename',
      },
      {
        title: '下载链接',
        dataIndex: 'file_path',
        renderText: text => {
          return (<a href={text}>
            点击下载
          </a>);
        },
        search: false,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        sorter: true,
        renderText: (text: number) => {
          return text * 1000;
        },
        valueType: 'dateTime',
        search: false,
      },
    ];

  return (
    <PageContainer>
      <ProTable<API.CostExcel, API.PageParams>
        headerTitle="成本Excel"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{ defaultPageSize: 10 }}
        request={costExcels}
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
          {/* <Button type="primary"> */}
          {/*  <FormattedMessage id="pages.searchTable.batchApproval" */}
          {/*                    defaultMessage="批量审批" /> */}
          {/* </Button> */}
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;
