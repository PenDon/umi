import React from 'react';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';

export type FormValueType = Partial<API.ProductCost>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.MailAccount>;
};



const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (<ModalForm
      title="修改产品报价"
      width="400px"
      visible={props.updateModalVisible}
      onFinish={props.onSubmit}
      modalProps={{
        onCancel: props.onCancel,
        destroyOnClose: true,
      }}
      initialValues={{
        account: props.values.account,
        remark: props.values.remark,
        id: props.values.id,
      }}

    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        label="邮箱账户"
        width="md"
        name="account"
      />
      <ProFormText.Password
        rules={[
          {
            required: true,
            message: '密码为必填项！',
          },
        ]}
        label="邮箱账户密码"
        width="md"
        name="pwd"
      />
      <ProFormText label="备注"
                   width="md"
                   name="remark" />
    </ModalForm>
  );
};

export default UpdateForm;
