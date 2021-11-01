import React from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';

export type FormValueType = Partial<API.ProductCost>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.ProductCost>;
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
        material: props.values.material,
        sku: props.values.sku,
        color: props.values.color,
        cost: props.values.cost,
        bead_cost: props.values.bead_cost,
        remark: props.values.remark,
        standards: props.values.standards,
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
        label="平台SKU"
        width="md"
        name="sku"
      />
      <ProFormText
        width="md"
        name="id"
        hidden={true}
      />
      <ProFormUploadButton
        label="图片"
        width="md"
        name="image"
        action={'/index.php/api/file/uploading?access_token='.concat(
          localStorage.getItem('access_token') as string,
        ).concat('&key=image')}
        fieldProps={{data: {'key': 'image', 'generate_thumbnail': 1, 'thumbnail_size': '100x100'}}}
      />
      // todo use ProFormTextArea
      <ProFormText label="材质"
                   width="md"
                   name="material" />
      <ProFormText label="颜色"
                   width="md"
                   name="color" />
      <ProFormTextArea label="规格"
                   width="md"
                   name="standards" />
      <ProFormText label="独立站成本(生产成本)"
                   width="md"
                   name="cost" />
      <ProFormText label="如加珠子/片单价"
                   width="md"
                   name="bead_cost" />
      <ProFormText label="备注"
                   width="md"
                   name="remark" />
    </ModalForm>
  );
};

export default UpdateForm;
