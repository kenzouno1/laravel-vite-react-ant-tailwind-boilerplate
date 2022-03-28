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
    Table,
    List,
    Popconfirm,
    Modal,
} from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDepartmentActions, useRoleActions } from "@/_actions";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import RoleModal from "./create-edit-role";
import { userCan } from '@/_state';

const CreateRole = ({}) => {
    const actions = useDepartmentActions();

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    const isEdit = !!id;

    const [saveLoading, setSaveLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(false);
    const [roles, setRoles] = useState([]);
    const [currentRole, setCurrentRole] = useState(null);

    const loadDetail = async () => {
        setLoading(true);
        const { data } = await actions.show(id);
        const roleBuild = [];
        const getRoleItem = async (item, level) => {
            roleBuild.push(item);
            if (item.childs || item.children_recursive) {
                (item.childs || item.children_recursive).map((child) =>
                    getRoleItem(child, level + 1)
                );
            }
        };
        data.roles.map((role) => getRoleItem(role, 0));
        setRoles(roleBuild);
        form.setFieldsValue({
            name: data.name,
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
            const values = form.getFieldsValue();
            setSaveLoading(true);
            if (isEdit) {
                await actions.update(id, {
                    ...values,
                });
            } else {
                await actions.create({
                    ...values,
                });
                setCaps([]);
                form.resetFields();
            }
            setSaveLoading(false);

            message.success(
                isEdit
                    ? "Cập nhật phòng ban thành công"
                    : "Thêm mới phòng ban thành công"
            );
        } catch (error) {
            console.error(error);
            // message.error(error.response.data.message);
        }
    };

    const canCreateRole = useRecoilValue(userCan("role.create"));
    const canDeleteRole = useRecoilValue(userCan("role.delete"));
    const canEditRole = useRecoilValue(userCan("role.update"));

    return (
        <div>
            <PageHeader
                title={isEdit ? "Cập nhật phòng ban" : "Thêm mới phòng ban"}
                onBack={() => navigate("/department")}
            />

            <Form
                form={form}
                onFinish={onSave}
                name="form"
                labelCol={{
                    span: 6,
                }}
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
                                        label="Tên phòng ban"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập tên phòng ban",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </>
                            )}
                        </Card>
                        <Card className="mt-3" title="Danh sách chức vụ">
                            <Table
                                dataSource={roles}
                                columns={[
                                    {
                                        title: "Tên chức vụ",
                                        dataIndex: "name",
                                        sorter: true,
                                    },
                                    {
                                        title: "Hành động",
                                        width: 150,
                                        render: (_, record) => (
                                            <div className="text-center">
                                                {loadingRow == record.id ? (
                                                    <Spin />
                                                ) : (
                                                    <Space size="middle">
                                                        {canCreateRole && (
                                                            <a
                                                                className="text-blue-400"
                                                                onClick={() =>
                                                                    setCurrentRole(
                                                                        record
                                                                    )
                                                                }
                                                            >
                                                                Cập nhật
                                                            </a>
                                                        )}
                                                        {canDeleteRole && (
                                                            <Popconfirm
                                                                title="Bạn chắc chắn chứ?"
                                                                onConfirm={() =>
                                                                    removeRole(
                                                                        record.id
                                                                    )
                                                                }
                                                            >
                                                                <a className="text-red-500">
                                                                    Xoá
                                                                </a>
                                                            </Popconfirm>
                                                        )}
                                                    </Space>
                                                )}
                                            </div>
                                        ),
                                    },
                                ]}
                                loading={loading}
                            ></Table>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Hành động">
                            {saveLoading ? (
                                <Spin />
                            ) : (
                                <Space>
                                    <Button
                                        disabled={loading}
                                        type="primary"
                                        className="bg-slate-600 text-white"
                                        htmlType="submit"
                                    >
                                        Lưu lại
                                    </Button>
                                    <Button
                                        type="default"
                                        className="bg-red-500 text-white"
                                        onClick={() => navigate("/department")}
                                    >
                                        Huỷ bỏ
                                    </Button>
                                </Space>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Form>
            {currentRole && (
                <RoleModal
                    onRequestClose={() => setCurrentRole(null)}
                    show
                    model={currentRole}
                />
            )}
        </div>
    );
};
export default CreateRole;
