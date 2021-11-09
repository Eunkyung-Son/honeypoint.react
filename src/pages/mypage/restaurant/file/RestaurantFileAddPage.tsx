import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Button, Card, message, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import { RcFile } from "antd/lib/upload";
import { SERVER_URL } from "../../../../config/config";
import { useRootStore } from "../../../../hooks/StoreContextProvider";
import RestaurantFileAddStore from "./RestaurantFileAddStore";
import './RestaurantFileAddPage.scss';

const RestaurantFileAddPage: React.FC = () => {
  const { authStore } = useRootStore();
  const [fileList, setFileList] = useState<(UploadFile)[]>([]);
  const [uploading, setUploading] = useState(false);
  const [restaurantFileAddStore] = useState(() => new RestaurantFileAddStore());
  const [originFiles, setOriginFiles] = useState<Map<string, File>>(new Map());

  useEffect(() => {
    async function init() {
      await fetchRestaurantInfo();
      if (!restaurantFileAddStore.restaurantData || !restaurantFileAddStore.restaurantData.fileIds) return;
      
      const files: Array<{
        blobData: Blob, fileId: string
      }> = await Promise.all(restaurantFileAddStore.restaurantData.fileIds.map((fileId) => fetchFileList(fileId)));
      console.log(files);
      const uploadFiles: UploadFile[] = files.map((el) => {
        const file = new File([el.blobData], el.fileId, {type: 'image/png' });
        const rcFile: RcFile = {
          uid: uuidv4(),
          lastModified: file.lastModified,
          lastModifiedDate: new Date(),
          name: file.name,
          size: file.size,
          webkitRelativePath: file.webkitRelativePath,
          type: file.type,
          arrayBuffer: file.arrayBuffer,
          slice: file.slice,
          stream: file.stream,
          text: file.text,
        }
        setOriginFiles(new Map(originFiles.set(rcFile.uid, file)));
        return {
          ...rcFile,
          url: `http://localhost:8082/api/file/restaurant/${restaurantFileAddStore.restaurantData?.rNo}/${el.fileId}`,
          originFileObj: rcFile,
        }
      })
      setFileList(uploadFiles);
    }
    init();
  }, [])

  const fetchRestaurantInfo = async () => {
    if (!authStore.member) return;
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
        restaurantFileAddStore.setRestaurantData(response.data.restaurant);
        
      })
  }

  const fetchFileList = async (fileId: string) => {
    const URL = `${SERVER_URL}/api/file/restaurant/${restaurantFileAddStore.restaurantData!.rNo}/${fileId}`;
    return await axios
      .get(URL,
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        console.log(response.data);
        return {
          blobData: response.data,
          fileId: fileId,
        };
      })
  }

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < originFiles.size; i++) {
      const file = originFiles.get(fileList[i].uid);
      formData.append('file', file as File);
    }

    setUploading(true);

    const URL = `${SERVER_URL}/api/file/restaurant/${restaurantFileAddStore.restaurantData?.rNo}`;
    console.log(formData.get('file'));
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
          setUploading(false);
        })

  }
  
  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return setFileList(newFileList);
    },
    beforeUpload: (file: RcFile, inputFileList: RcFile[]) => {
      console.log(file, inputFileList, "dfd");
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

  const handleChange = (info: UploadChangeParam) => {
    const { file, fileList } = info;
    console.log(file);
    setOriginFiles(new Map(originFiles.set(file.uid, file as RcFile)));
    setFileList(fileList);
    console.log(fileList, originFiles);

    for (let i = 0; i < originFiles.size; i++) {
      console.log("dfdf",originFiles.get(fileList[i].uid));
    }
    const originFile = originFiles.get(fileList[0].uid);
    console.log(originFile);

  }

  return (
    <div className="RestaurantFileAddPage">
      <Card style={{ width: '50%', marginRight: '25%', marginLeft: '25%', marginTop: "3%"}}>
      <h2>레스토랑 사진 등록</h2>
      <p style={{color: "gray"}}>HONEYPOINT 이용자들에게 보여줄 사진을 등록해보세요!</p>
        <Upload 
          {...uploadProps}
          listType="picture"
          defaultFileList={[...fileList]}
          onChange={handleChange}
        >
          <Button icon={<UploadOutlined />}>사진 선택</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? '업로드 중...' : '업로드 시작하기'}
        </Button>
      </Card>
    </div>
  )
}

export default observer(RestaurantFileAddPage)