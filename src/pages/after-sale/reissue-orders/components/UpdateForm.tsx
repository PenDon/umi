import React from 'react';
import {
  ModalForm, ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';

export type FormValueType = Partial<API.Order>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Order>;
};



const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (<ModalForm
      title="修改定制信息"
      width="400px"
      visible={props.updateModalVisible}
      onFinish={props.onSubmit}
      modalProps={{
        onCancel: props.onCancel,
        destroyOnClose: true,
      }}
      initialValues={{
        custom_info: props.values.custom_info,
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
        label="定制信息"
        width="md"
        name="custom_info"
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
