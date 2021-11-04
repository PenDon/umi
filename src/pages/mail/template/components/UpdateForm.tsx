import React from 'react';
import { Modal } from 'antd';
import ProForm, {
  ProFormGroup,
  ProFormList,
  ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';

export type FormValueType = {
} & Partial<API.MailTemplate>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.MailTemplate>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改模板"
      visible={props.updateModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
      footer={false}
    >
      <ProForm
        initialValues={{
          id: props.values.id,
          keywords: props.values.keywords,
          name: props.values.name,
          subject: props.values.subject,
          remark: props.values.remark,
          body: props.values.body,
        }}
        onFinish={async (values) => {
          await props.onSubmit(values);
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
          label="模板名称"
          width="md"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
          label="模板主题"
          width="md"
          name="subject"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
          label="模板内容"
          width="md"
          name="body"
        />
        <ProFormText name="remark" label="备注" />
        <ProFormText name="id" hidden={true} />
        <ProFormList name="keywords" label="模板关键字">
          <ProFormGroup>
            <ProFormText
              rules={[
                {
                  required: true,
                },
              ]}
              name="name"
              label="关键字"
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
