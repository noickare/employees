import { Button, Form, Input, Space, Spin, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { searchName, terminateEmployee } from './api';

import { API_URL } from './constants';
import type { ColumnsType } from 'antd/es/table';
import EmployeeModal from './components/Modal';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { getDateWithoutTime } from './utils';

const { Search } = Input;


export interface IEmployee {
  id: string;
  name: string;
  dateHired: string;
  isActive: boolean;
  dateTerminated?: string;
  numOfWeekWorkHours: number;
  hourlyPayRate: number;
  weeklyNet: number;
  taxes: number;
  payout: number;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [activeEdit, setActiveEdit] = useState<undefined | IEmployee>()
  const [searchTerm, setSearchTerm] = useState("");

  const columns: ColumnsType<IEmployee> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date Hired',
      dataIndex: 'dateHired',
      key: 'dateHired',
    },
    {
      title: 'Active',
      key: 'isActive',
      dataIndex: 'isActive',
      render: text => <span>{text.toString()}</span>,
    },
    {
      title: 'Date terminated',
      dataIndex: 'dateTerminated',
      key: 'dateTerminated',
    },
    {
      title: 'Week work hours',
      dataIndex: 'numOfWeekWorkHours',
      key: 'numOfWeekWorkHours',
    },
    {
      title: 'Hourly Pay',
      key: 'hourlyPayRate',
      dataIndex: 'hourlyPayRate',
    },
    {
      title: 'Weekly net salary',
      key: 'weeklyNet',
      dataIndex: 'weeklyNet',
    },
    {
      title: 'Taxes',
      key: 'taxes',
      dataIndex: 'taxes',
    },
    {
      title: 'Weekly Payout',
      key: 'payout',
      dataIndex: 'payout',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => {
            setActiveEdit(record);
            setIsModalVisible(true);
          }}>Edit</Button>
          {
            record.isActive && (
              <Button type="primary" danger onClick={async () => {
                try {
                  await terminateEmployee(record.id);
                  const updatedData = data.map((employee) => {
                    if (employee.id == record.id) {
                      const now = new Date();
                      return { ...employee, isActive: false, dateTerminated: getDateWithoutTime(now.toString()) };
                    }
                    return employee;
                  })
                  setData(updatedData);
                } catch (error: any) {
                  alert(error.message);
                }
              }}>Terminate</Button>
            )
          }
        </Space>
      ),
    },
  ];



  const getData = useCallback(async () => {
    const response = await axios.get(
      `${API_URL}/employees`
    )
    const tableData = response.data.map((emp: IEmployee) => {
      return {
        key: emp.id,
        id: emp.id,
        name: emp.name,
        dateHired: getDateWithoutTime(emp.dateHired),
        isActive: emp.isActive,
        dateTerminated: emp.dateTerminated ? getDateWithoutTime(emp.dateTerminated) : 'N/A',
        numOfWeekWorkHours: emp.numOfWeekWorkHours,
        hourlyPayRate: emp.hourlyPayRate,
        weeklyNet: emp.hourlyPayRate * emp.numOfWeekWorkHours,
        taxes: '16%',
        payout: (emp.hourlyPayRate * emp.numOfWeekWorkHours) * 0.84
      }
    })
    setData(tableData)
  }, [])

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    const employee = {
      name: values.name,
      dateHired: values.dateHired.toString(),
      isActive: !values.dateTerminated ? true : false,
      dateTerminated: values.dateTerminated,
      numOfWeekWorkHours: values.numOfWeekWorkHours,
      hourlyPayRate: values.rate,
    }
    try {
      if (!activeEdit) {
        await axios.post(`${API_URL}/employee`, employee);
        await getData();
        form.resetFields();
        setIsSubmitting(false);
        setIsModalVisible(false);
      } else {
        await (await axios.patch(`${API_URL}/employee/${activeEdit.id}`, { ...employee, id: activeEdit.id, dateTerminated: values.dateTerminated ? values.dateTerminated : undefined })).data;
        await getData();
        form.resetFields();
        setIsSubmitting(false);
        setIsModalVisible(false);
      }
    } catch (error: any) {
      console.log(error);
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  const debouncedOnSearch = debounce(async () => {
    const searchResults = await searchName(searchTerm);
    if (searchResults.length) setData(searchResults)
  }, 500);

  const onSearch = async (e: any) => {
    setSearchTerm(e.target.value);
    debouncedOnSearch();
  };


  useEffect(() => {
    getData().then(() => setIsLoading(false));
  }, [getData])

  return (
    <div>
      {
        !isLoading ? (
          <div style={{ margin: 40 }}>
            <Button
              style={{ marginBottom: 20, width: '100%' }}
              onClick={() => {
                setActiveEdit(undefined);
                setIsModalVisible(true)
              }} type="primary" shape="round" icon={<PlusCircleOutlined />} size="large">
              Add Employee
            </Button>
            <Search
              style={{ marginBottom: 20 }}
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onChange={onSearch}
              value={searchTerm}
            />
            <Table columns={columns} dataSource={data} />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
          </div>
        )
      }
      <EmployeeModal isOpen={isModalVisible} setIsModalVisible={() => setIsModalVisible(false)} onFinish={onFinish} isSubmitting={isSubmitting} employee={activeEdit} />
    </div>
  );
}

export default App;
