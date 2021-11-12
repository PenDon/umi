import React from 'react';
import {
  ModalForm, ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';

export type FormValueType = Partial<API.FrontendProduct>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.FrontendProduct>;
};



const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (<ModalForm
      title="修改产品"
      width="400px"
      visible={props.updateModalVisible}
      onFinish={props.onSubmit}
      modalProps={{
        onCancel: props.onCancel,
        destroyOnClose: true,
      }}
      initialValues={{
        id: props.values.id,
      }}


    >
      <ProFormTextArea
        rules={[
          {
            required: true,

            message: '必填项',
          },
        ]}
        label="产品名字"
        width="md"
        name="name"
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
