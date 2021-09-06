
import {
  departmentList,
  stepList,
} from '@/services/ant-design-pro/api';
import { processes } from '@/services/ant-design-pro/processes';
import { StatisticCard } from '@ant-design/pro-card';
import React from 'react';
import { Tag, Timeline } from 'antd';

const { Operation } = StatisticCard;

// processList
export async function processRequest() {
  const response = await processes({}, {}, {});
  let a = [{}];
  if (response.data)
    a = response.data.map((item: API.Process) => {
      return { label: item.name, value: item.id };
    });


  return a;
}

// stepList
export async function stepRequest() {
  const response = await stepList();

  return response.data;
}

// departmentList
export async function departmentRequest() {
  const response = await departmentList();
  let d = [];
  for (const item in response.data) {
    d.push({ 'label': response.data[item], 'value': item });
  }

  // return response.data;
  return d;
}

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
