import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { SERVER_URL } from "../../../config/config";
import { useRootStore } from "../../../hooks/StoreContextProvider";
import RestaurantMyInfoStore from "./RestaurantMyInfoStore";
import { RcFile } from "antd/lib/upload";

type Props = {

}

const RestaurantMyInfoPage: React.FC<Props> = observer((props: Props) => {
  const { authStore } = useRootStore();
  const [restaurantMyInfoStore] = useState(() => new RestaurantMyInfoStore());
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);
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
        restaurantMyInfoStore.setRestaurantData(response.data.restaurant);
        console.log(restaurantMyInfoStore.restaurantData);
      })
  }

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files', file);
    });

    console.log(formData);

    setUploading(true);

    const URL = `${SERVER_URL}/api/file/restaurant/${restaurantMyInfoStore.restaurantData?.rNo}`;
    console.log(formData);
      await axios
        .post(URL,
          
          formData
          ,{
            headers: {
              'content-type': 'multipart/form-data'
            },
          }
        )
        .then((response: AxiosResponse) => {
          console.log(response);
          setFileList([]);
          setUploading(false);
          message.success('upload successfully.');
        }).catch((error) => {
          message.error('upload failed.');
        })

  }
  
  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return setFileList(newFileList);
    },
    beforeUpload: (file: RcFile, inputFileList: RcFile[]) => {
      if (inputFileList.length) {
        setFileList([...fileList, ...inputFileList]);
      } else {
        setFileList([...fileList, file]);
      }
      return false;
    },
    fileList,
    multiple: true,
  };

  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </>
  )
})

export default RestaurantMyInfoPage