import React from 'react';
import { Modal } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';

export type FormValueType = {
} & Partial<API.MemberListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.MemberListItem>;
  departmentList: any[];
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  console.log(props.departmentList)

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改用户"
      visible={props.updateModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
      footer={false}
    >
      <ProForm
        initialValues={{
          username: props.values.username,
          id: props.values.id,
          remark: props.values.remark,
          category_id: props.values.category_id + "",
          type: props.values.type + "",
        }}
        onFinish={async (values) => {
          await props.onSubmit(values);
        }}
      >
        <ProFormText
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名称！' }]}
        />
        <ProFormSelect
          width="md"
          name="category_id"
          label="所属部门"
          options={props.departmentList}
        />
        <ProFormSelect
          width="md"
          name="type"
          label="员工类型"
          valueEnum={{
            2: '部门主管',
            3: '普通员工',
            4: '部门组长',
          }}
        />
        <ProFormTextArea width="md"
                         name="remark"
                         label="备注" />
        <ProFormText name="id" hidden={true} />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
