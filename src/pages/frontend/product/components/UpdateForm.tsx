import React, { useRef } from 'react';
import ProForm, {
  ModalForm, ProFormSelect, ProFormText,
} from '@ant-design/pro-form';
import { CustomImageUpload } from '@/components/Common';
import MyComponent from '@/components/Common/quill';

export type FormValueType = Partial<API.FrontendProduct>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.FrontendProduct>;
  categories: any[];
};



const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  /** 富文本 ref */
  const richTextRef = useRef<{props: {value: string}}>();

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
        name: props.values.name,
        category_id: props.values.category_id,
        origin_place: props.values.origin_place,
        brand: props.values.brand,
        certification: props.values.certification,
        model_number: props.values.model_number,
        min_order_quantity: props.values.min_order_quantity,
        price: props.values.price,
        package_details: props.values.package_details,
        delivery_time: props.values.delivery_time,
        payment: props.values.payment,
        supply_ability: props.values.supply_ability,
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
        label="产品名称"
        width="md"
        name="name"
      />
      <CustomImageUpload
        label="产品图片"
        fieldList={props.values.images?.map((image) => {
          return {url: image.real_path};
        })}
        width="md"
        name="image"
        multiple={true}
        listType='picture-card'
        action={'/index.php/api/file/uploading?access_token='.concat(
          localStorage.getItem('access_token') as string,
        ).concat('&key=image')}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        options={props.categories}
        label="产品类别"
        name="category_id"
      />
      <ProForm.Item
        name='description'
        label='产品描述'
      >
        <MyComponent richTextRef={richTextRef} defaultValue={props.values.description}/>
      </ProForm.Item>
      <ProFormText label="产地"
                   width="md"
                   name="origin_place" />
      <ProFormText label="品牌"
                   width="md"
                   name="brand" />
      <ProFormText label="证书"
                   width="md"
                   name="certification" />
      <ProFormText label="型号"
                   width="md"
                   name="model_number" />
      <ProFormText label="最小起订量"
                   width="md"
                   name="min_order_quantity" />
      <ProFormText label="价格"
                   fieldProps={{value: "Negotiable"}}
                   width="md"
                   name="price" />
      <ProFormText label="包装细节"
                   width="md"
                   name="package_details" />
      <ProFormText label="配送/发货时间"
                   width="md"
                   name="delivery_time" />
      <ProFormText label="支付相关"
                   width="md"
                   name="payment" />

      <ProFormText label="月供应能力"
                   width="md"
                   name="supply_ability" />
      <ProFormText
        width="md"
        name="id"
        hidden={true}
      />
    </ModalForm>
  );
};

export default UpdateForm;
