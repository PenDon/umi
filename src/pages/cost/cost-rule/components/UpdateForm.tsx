import React, { useState } from 'react';
import { Modal } from 'antd';
import ProForm, {
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';

export type FormValueType = {
  ruleValues?: API.CostRuleValue[];
  remark?: string;
  created_at?: number;
  creator?: string;
  updated_at?: number;
  updater?: string;
} & Partial<API.CostRule>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.CostRule>;
};
/** 珠子单价是否展示 */
const [showBeadPrice, setShowBeadPrice] = useState<boolean>(true);

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改规则"
      visible={props.updateModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
      footer={false}
    >
      <ProForm
        initialValues={{
          sku: props.values.sku,
          initial_price: props.values.initial_price,
          bead_price: props.values.bead_price,
          has_beads: props.values.has_beads + '',
          flag: props.values.flag + '',
          id: props.values.id,
          ruleValues: props.values.ruleValue,
        }}
        onFinish={async (values) => {
          await props.onSubmit(values);
        }}
      >
        <ProFormText
          name="sku"
          label="SKU(关键字检索)"
          rules={[{ required: true, message: '必填项！' }]}
        />
        <ProFormText
          name="initial_price"
          label="初始价格"
          rules={[{ required: true, message: '必填项！' }]}
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
                setShowBeadPrice(false);
              } else {
                setShowBeadPrice(true);
              }
            }
          }}
        />
        <ProFormSelect
          name="flag"
          label="是否区分珠子颜色"
          valueEnum={{
            1: '是',
            0: '否',
          }}
          placeholder="请选择"
          fieldProps={{
            onChange: value => {
              if (value == 1) {
                setShowBeadPrice(false);
              } else {
                setShowBeadPrice(true);
              }
            }
          }}
        />
        <ProFormText
          hidden={!showBeadPrice}
          name="bead_price"
          label="珠子单价(不区分珠子颜色)"
        />
        <ProFormText name="remark" label="备注" />
        <ProFormText name="id" hidden={true} />
        <ProFormList name="ruleValues" label="额外选项">
          <ProFormGroup>
            <ProFormText
              rules={[
                {
                  required: true,
                },
              ]}
              name="keyword"
              label="选项关键字"
              placeholder="请输入选项关键字"
            />
            <ProFormText
              rules={[
                {
                  required: true,
                },
              ]}
              name="extra_cost"
              label="该选项额外成本"
              placeholder="请输入该选项额外成本"

            />
            <ProFormText
              name="bead_price"
              label="珠子单价(区分珠子颜色)"
              placeholder="请输入珠子单价(区分珠子颜色)"
            />
            <ProFormText
              name="id"
              hidden={true}
            />
          </ProFormGroup>
        </ProFormList>
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
