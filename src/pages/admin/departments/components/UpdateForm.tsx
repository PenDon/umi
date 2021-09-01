import React from 'react';
import {
  ModalForm, ProFormText,
} from '@ant-design/pro-form';

export type FormValueType = {} & Partial<API.Department>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Department>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (<ModalForm
      title="修改"
      width="400px"
      visible={props.updateModalVisible}
      onFinish={props.onSubmit}
      modalProps={{
        onCancel: props.onCancel,
        destroyOnClose: true,
      }}
      initialValues={{
        name: props.values.name,
        id: props.values.id,
        description: props.values.description,
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        label="部门名称"
        width="md"
        name="name"
      />
      <ProFormText
        width="md"
        name="description"
        label="备注"
      />
      <ProFormText
        width="md"
        name="id"
        hidden={true}
      />
    </ModalForm>
  );
};

export default UpdateForm;
