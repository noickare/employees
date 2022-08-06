import { Button, DatePicker, Form, Input, InputNumber, Modal } from 'antd';
import React, { useEffect } from 'react'

import type { FormInstance } from 'antd/es/form';
import { IEmployee } from '../App';
import moment from 'moment';

interface IEmployeeModal {
    isOpen: boolean;
    employee?: IEmployee;
    setIsModalVisible: () => void;
    onFinish: (values: any) => void;
    isSubmitting: boolean;
}

const layout = {
    labelCol: { span: 8 },
    // wrapperCol: { span: 32},
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
}

export default function EmployeeModal(props: IEmployeeModal) {
    const formRef = React.createRef<FormInstance>();
    const [form] = Form.useForm();
    const { employee } = props;

    useEffect(() => {
        if (props.employee) {
            form.setFieldsValue({
                id: employee?.id,
                name: employee?.name,
                dateHired: employee?.dateHired && moment(new Date(employee.dateHired)),
                dateTerminated: employee?.dateTerminated !== "N/A" && moment(new Date(employee?.dateTerminated as string)),
                numOfWeekWorkHours: employee?.numOfWeekWorkHours,
                rate: employee?.hourlyPayRate
            });
        } else {
            form.resetFields();
        }
    }, [props.employee])

    return (
        <Modal footer={null} title="Add Employee" visible={props.isOpen} onCancel={props.setIsModalVisible}>
            <Form form={form} className="form" {...layout} ref={formRef} name="control-ref" onFinish={props.onFinish}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: "Employee name is required!" }]}>
                    <Input className='form_input' />
                </Form.Item>
                <Form.Item name="dateHired" label="Date Hired" rules={[{ required: true, message: "Date Hired is required!" }]}>
                    <DatePicker className='form_input' />
                </Form.Item>
                <Form.Item name="numOfWeekWorkHours" label="Hours" rules={[{ required: true, message: "Weekly work hours is required!" }]}>
                    <InputNumber className='form_input' placeholder="weekly work hours" />
                </Form.Item>
                <Form.Item name="rate" label="Rate" rules={[{ required: true, message: "Rate is required!" }]}>
                    <InputNumber className='form_input' placeholder="Hourly rate" />
                </Form.Item>
                <Form.Item name="dateTerminated" label="Date Terminated">
                    <DatePicker className='form_input' />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button loading={props.isSubmitting} disabled={props.isSubmitting} type="primary" htmlType="submit">
                        {!employee ? 'Add employee' : 'Update employee'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
