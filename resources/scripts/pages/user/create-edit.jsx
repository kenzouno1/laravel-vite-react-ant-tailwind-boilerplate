import {
    Form,
    Input,
    PageHeader,
    Card,
    Col,
    Row,
    Button,
    Space,
    message,
    Spin,
    Avatar,
} from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useUserActions } from "@/_actions";
import { useParams } from "react-router-dom";
import UploadFile from "@/components/upload";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const CreateRole = ({}) => {
    const userActions = useUserActions();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    const isEdit = !!id;

    const [saveLoading, setSaveLoading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [model, setModel] = useState({
        avatar: null,
    });

    const loadDetail = async () => {
        setLoading(true);
        const { data } = await userActions.show(id);
        form.setFieldsValue(data);
        setModel({
            avatar: data.avatar,
        });
        setLoading(false);
    };

    useEffect(() => {
        if (id) {
            loadDetail();
        }
    }, []);

    const onSave = async () => {
        try {
            const values = await form.validateFields();
            setSaveLoading(true);
            if (isEdit) {
                await userActions.update(id, {
                    ...values,
                    ...model,
                });
            } else {
                await userActions.create({
                    ...values,
                    ...model,
                });
                form.resetFields();
            }
            setSaveLoading(false);

            message.success(
                isEdit
                    ? "Cập nhật người dùng thành công"
                    : "Thêm mới người dùng thành công"
            );
        } catch (error) {
            setSaveLoading(false);
            console.log(error);
            message.error(error.response.data.message);
        }
    };
    return (
        <div>
            <PageHeader
                title={isEdit ? "Cập nhật người dùng " : "Thêm mới người dùng "}
                onBack={() => navigate("/user")}
            />

            <Form
                form={form}
                labelCol={{
                    span: 6,
                }}
                name="form"
                onFinish={onSave}
            >
                <Row gutter={15}>
                    <Col span={18}>
                        <Card title="Thông tin">
                            {loading ? (
                                <Spin />
                            ) : (
                                <>
                                    <Form.Item
                                        name="name"
                                        label="Họ tên"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập họ và tên",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="username"
                                        label="Username"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập username",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Row>
                                        <Col span={18} push={6}>
                                            <UploadFile
                                                multiple={false}
                                                showUploadList={false}
                                                showPercent
                                                onUploadSuccess={(file) =>{
                                                    console.log(file)
                                                    setModel({
                                                        ...model,
                                                        avatar: file.url,
                                                    })}
                                                }
                                            >
                                                <Avatar
                                                    className="cursor-pointer"
                                                    src={model.avatar}
                                                    shape="square"
                                                    size={150}
                                                    onClick={() =>
                                                        setShowUpload(true)
                                                    }
                                                    icon={<UserOutlined />}
                                                />
                                            </UploadFile>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Hành động">
                            {saveLoading ? (
                                <Spin />
                            ) : (
                                <Space>
                                    <Button
                                        htmlType={"submit"}
                                        disabled={loading}
                                        type="primary"
                                        className="bg-slate-600 text-white"
                                        onClick={() => onSave()}
                                    >
                                        Lưu lại
                                    </Button>
                                    <Button
                                        type="default"
                                        className="bg-red-500 text-white"
                                        onClick={() => navigate("/user")}
                                    >
                                        Huỷ bỏ
                                    </Button>
                                </Space>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};
export default CreateRole;
