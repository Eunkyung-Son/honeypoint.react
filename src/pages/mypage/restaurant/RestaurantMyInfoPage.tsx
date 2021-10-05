import { Button, Form, Upload } from "antd";
import { observer } from "mobx-react";
import { UploadOutlined } from '@ant-design/icons';

import { useRootStore } from "../../../hooks/StoreContextProvider";
import { SERVER_URL } from "../../../config/config";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";

type Props = {

}

const RestaurantMyInfoPage: React.FC<Props> = observer((props: Props) => {
  const { authStore } = useRootStore();
  console.log(authStore.member)

  useEffect(() => {
    restaurantInfo();
    console.log(authStore);
  }, [])

  const restaurantInfo = async () => {
    if (!authStore.member) return;
    console.log(authStore, "dsffsdsdf");
    console.log(authStore.member);
    const URL = `${SERVER_URL}/api/restaurantByMember/${authStore.member?.mNo}`;
    await axios
      .get(URL,
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        console.log(response);
      })
  }
  
  const onFinish = async (values: any) => {
    const URL = `${SERVER_URL}/api/file/restaurant/`;
      await axios
        .post(URL,
          {
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        )
        .then((response: AxiosResponse) => {
          console.log(response);
        })
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Form.Item
          name="upload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="longgggggggggggggggggggggggggggggggggg"
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>

{/* 
          <Upload
        name="file"
        accept="image/png"
        action="http://localhost:8082/api/file/restaurant/4"
        onChange= {(info) => {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        }}
      >
        <Button>click</Button>
      </Upload>
      <img src="http://localhost:8082/api/file/restaurant/4/6ed6f651-d9a6-4a31-8d69-1053651d6efb.png"/> */}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
})

export default RestaurantMyInfoPage