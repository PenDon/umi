import React from 'react';
import { Modal } from 'antd';
import ProForm, { ProFormGroup, ProFormList, ProFormText, StepsForm } from '@ant-design/pro-form';

export type FormValueType = {
  id?: number;
  name?: string;
  steps?: API.Step[];
  remark?: string;
  created_at?: number;
  creator?: string;
  updated_at?: number;
  updater?: string;
} & Partial<API.Process>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Process>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title="修改流程"
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            <ProForm
              initialValues={{
                name: props.values.name,
                remark: props.values.remark,
                steps: props.values.steps,
              }}
              onFinish={async (values) => {
                await props.onSubmit(values);
              }}
            >
              <ProFormText
                name="name"
                label="流程名称"
                rules={[{ required: true, message: '请输入流程名称！' }]}
              />
              <ProFormText name="remark" label="备注" />
              <ProFormList name="steps" label="步骤">
                <ProFormGroup>
                  <ProFormText
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    name="name"
                    label="步骤名称"
                  />
                </ProFormGroup>
              </ProFormList>
            </ProForm>
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    ></StepsForm>
  );
};

export default UpdateForm;
