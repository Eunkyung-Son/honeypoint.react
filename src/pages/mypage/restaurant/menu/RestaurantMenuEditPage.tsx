import { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import axios, { AxiosResponse } from 'axios';
import { Form, Input, Button, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { SERVER_URL } from '../../../../config/config';
import { useRootStore } from '../../../../hooks/StoreContextProvider';
import RestaurantMenuEditStore from "./RestaurantMenuEditStore";
import './RestaurantMenuEditPage.scss';

const RestaurantMenuEditPage: React.FC = () => {
  const { authStore } = useRootStore();
  const [form] = useForm();
  const [restaurantMenuEditStore] = useState(() => new RestaurantMenuEditStore());

  const fetchRestaurantInfo = async () => {
    if (!authStore.member) return;
    const URL = `${SERVER_URL}/api/restaurantByMember/${authStore.member?.mNo}`;
    const response = await axios
      .get(URL,
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      restaurantMenuEditStore.setRestaurantData(response.data.restaurant);
  }

  const fecthRestaurantMenuInfo = async () => {
    const URL = `${SERVER_URL}/api/restaurant/${restaurantMenuEditStore.restaurantData?.rNo}`;
    const params = {
      fetchMenuList: true
    }
    await axios
      .get(URL,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            ...params
          }
        }
      )
      .then((response: AxiosResponse) => {
        console.log(response);
        const menus = response.data.menus;
        form.setFieldsValue({
          menus: menus
        })
      })
  }
  
  useEffect(() => {
    const init = async () => {
      await fetchRestaurantInfo();
      await fecthRestaurantMenuInfo();
    }
    init();
  }, [])

  const onRestaurantMenuSave = async (values: {
    menuName: string,
    menuPrice: string,
    rNo: number,
  }) => {
    const URL = `${SERVER_URL}/api/menu/updateMenu/${restaurantMenuEditStore.restaurantData?.rNo}`;
    await axios
      .post(URL,
        {
          ...form.getFieldsValue(),
          ...values
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      ).then((response: AxiosResponse) => {
        console.log(response);
      })

  }

  return (
    <div className="RestaurantMenuEditPage">
      <Form
        name="dynamic_form_nest_item"
        onFinish={onRestaurantMenuSave}
        autoComplete="off"
        form={form}
      >
        <Form.List name="menus">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'menuName']}
                    fieldKey={[fieldKey, 'menuName']}
                    rules={[{ required: true, message: '이름을 입력해주세요.' }]}
                  >
                    <Input placeholder="메뉴 이름을 입력해주세요." />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'menuPrice']}
                    fieldKey={[fieldKey, 'menuPrice']}
                    rules={[{ required: true, message: '가격을 입력해주세요.' }]}
                  >
                    <Input placeholder="메뉴 가격을 입력해주세요." />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                  <Form.Item
                    name={[name, 'rNo']}
                    fieldKey={[fieldKey, 'rNo']}
                    initialValue={restaurantMenuEditStore.restaurantData?.rNo}
                  >
                    <Input type="hidden" value={restaurantMenuEditStore.restaurantData?.rNo} />
                  </Form.Item>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  메뉴 추가
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            등록 및 수정
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default observer(RestaurantMenuEditPage)