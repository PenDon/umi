import {
  departmentList,
  stepList,
} from '@/services/ant-design-pro/api';
import { processes } from '@/services/ant-design-pro/processes';
import { StatisticCard } from '@ant-design/pro-card';
import React from 'react';
import { Tag, Timeline } from 'antd';
import { listCategory } from '@/services/ant-design-pro/frontend-product';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { UploadListType } from 'antd/es/upload/interface';

const { Operation } = StatisticCard;

// process list
export async function processesRequest() {
  const response = await processes({}, {}, {});
  let a;
  if (response.data)
    a = response.data.map((item: API.Process) => {
      return { label: item.name, value: item.id };
    });


  return a;
}

// step list
export async function stepsRequest() {
  const response = await stepList();

  return response.data;
}

// department list
export async function departmentsRequest() {
  const response = await departmentList();
  let d = [];
  for (const item in response.data) {
    if (response.data.hasOwnProperty(item)) {
      d.push({
        'label': response.data[item],
        'value': item,
      });
    }
  }

  return d;
}

// product category list
export async function categoriesRequest() {
  const response = await listCategory();
  let d = [];
  for (const item in response.data) {
    if (response.data.hasOwnProperty(item)) {
      d.push({
        'label': response.data[item],
        'value': item,
      });
    }
  }

  return d;
}

export type CustomImageUploadProps = {
  multiple: boolean;
  label: string;
  name: string;
  width: number | "sm" | "md" | "xl" | "xs" | "lg" | undefined;
  action: string;
  listType: UploadListType;
  fieldList?: any[];
};

export const CustomImageUpload: React.FC<CustomImageUploadProps> = (props) => {
  return (<ProFormUploadButton
    fieldProps={{multiple: props.multiple, listType: props.listType}}
    label={props.label}
    name={props.name}
    fileList={props.fieldList}
    width={props.width}
    action={props.action}
    onChange={(info) => {
      if (info.file.status === 'done') {
        // console.log(info)
      }
    }}
  />);
};

// 单量
export function renderOrdersQuantity(data: readonly any[]) {
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
          value: 'xxx',
        }}
      />
      <Operation>+</Operation>
      <StatisticCard
        statistic={{
          title: 'XXX单',
          value: 'xxx',
        }}
      />
      <Operation>+</Operation>
      <StatisticCard
        statistic={{
          title: 'YYY单',
          value: 'xxx',
        }}
      />
    </StatisticCard.Group>
  );
}

// timeLine
export function renderTimeLine(row: API.OrderBatch | undefined) {
  if (row?.stepDetails && row.stepDetails.length !== 0) {
    const details = row.stepDetails;

    return (
      <Timeline mode="left">
        {details.map((detail: any) => {
          let name = '';
          switch (parseInt(detail.type)) {
            case 0:
              name = '安排';
              break;
            case 1:
              name = '接取';
              break;
            case 2:
              name = '提交';
              break;
            case 3:
              name = '完成';
              break;
            default:

          }
          return (
            <Timeline.Item key={detail.id}
                           label={detail.created_at}>
              {name}
              {detail.name}任务 By <Tag color={'blue'}
                                      key={'username'}>{detail.username}</Tag>
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  }
  return '-';
}
