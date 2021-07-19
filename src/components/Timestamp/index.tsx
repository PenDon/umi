import React from 'react';

export type TimestampProps = {
  timestamp: number;
};

const Timestamp: React.FC<TimestampProps> = (props) => {
  const date = new Date(props.timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() + ' ';
  const h = date.getHours() + ':';
  const m = date.getMinutes() + ':';
  const s = date.getSeconds();

  return (<span> {`${Y+M+D+h+m+s}`} </span>);
}

export default Timestamp;
