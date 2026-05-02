import React from "react";
import { Form, Input, Select, Button, message } from "antd";
import axios from "axios";

const { Option } = Select;

function CandidateForm({ refresh, editData, isEdit }) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (isEdit && editData) {
            form.setFieldsValue({
                ...editData,
                skills: Array.isArray(editData.skills) ? editData.skills.join(", ") : editData.skills
            });
        } else {
            form.resetFields();
        }
    }, [editData, isEdit, form]);

    const onFinish = async (values) => {
        try {
            const data = {
                ...values,
                skills: values.skills.split(",").map((skill) => skill.trim()),
                experience: Number(values.experience),
            };

            if (isEdit && editData?._id) {
                await axios.put(`http://localhost:5000/api/candidates/${editData._id}`, data);
                message.success("Candidate updated successfully");
            } else {
                await axios.post("http://localhost:5000/api/candidates", data);
                message.success("Candidate added successfully");
            }
            form.resetFields();
            refresh();
        } catch (err) {
            message.error(isEdit ? "Failed to update candidate" : "Failed to add candidate");
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ status: "Applied" }}
        >
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input placeholder="Full Name" />
            </Form.Item>
            
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="Email Address" />
            </Form.Item>
            
            <Form.Item label="Phone" name="phone">
                <Input placeholder="Phone Number" />
            </Form.Item>
            
            <Form.Item label="Skills (comma separated)" name="skills">
                <Input placeholder="e.g. React, Node.js, SQL" />
            </Form.Item>
            
            <Form.Item label="Experience (Years)" name="experience">
                <Input type="number" placeholder="Years of experience" />
            </Form.Item>
            
            <Form.Item label="Location" name="location">
                <Input placeholder="e.g. New York / Remote" />
            </Form.Item>
            
            <Form.Item label="Status" name="status">
                <Select>
                    <Option value="Applied">Applied</Option>
                    <Option value="Shortlisted">Shortlisted</Option>
                    <Option value="Interview">Interview</Option>
                    <Option value="Selected">Selected</Option>
                    <Option value="HIRED">Hired</Option>
                    <Option value="Rejected">Rejected</Option>
                </Select>
            </Form.Item>
            
            <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                    {isEdit ? "Update Candidate" : "Add Candidate"}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default CandidateForm;