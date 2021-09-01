import React from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { Modal } from 'antd';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.OrderBatch>;
  options: any[];
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  console.log(props.options)
  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改处理流程"
      visible={props.updateModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
      footer={false}
    >
      <ProForm
        initialValues={{
          id: props.values.id,
          process_id: props.values.process_id,
        }}
        onFinish={async (values) => {
          await props.onSubmit(values);
        }}
      >

        <ProFormSelect
          width="md"
          name="process_id"
          label="处理流程"
          options={props.options}
        />
        <ProFormText name="id" hidden={true} />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
