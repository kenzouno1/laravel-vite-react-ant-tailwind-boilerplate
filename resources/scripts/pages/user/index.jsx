import {
    PageHeader,
    Card,
    Table,
    Button,
    Modal,
    Space,
    Popconfirm,
    Spin,
} from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Create from "./create-edit";
import { userCan } from "@/_state";
import { useRecoilValue } from "recoil";
import { usersAtom } from "@/_state";
import { useUserActions } from "@/_actions";

const UserPage = ({ ...props }) => {
    const userAction = useUserActions();
    const navigate = useNavigate();
    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const users = useRecoilValue(usersAtom);

    const canCreate = useRecoilValue(userCan("user.create"));
    const canDelete = useRecoilValue(userCan("user.delete"));
    const canEdit = useRecoilValue(userCan("user.update"));

    const loadData = async () => {
        setLoading(true);
        await userAction.getList();
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const remove = async (id) => {
        setLoadingRow(id);
        await userAction.destroy(id);
        setLoadingRow(null);
    };
    return (
        <div>
            <PageHeader
                title={"Phân quyền"}
                extra={
                    canCreate && (
                        <Button
                            onClick={() => navigate("/user/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm người dùng
                        </Button>
                    )
                }
            />
            <Card>
                <Table
                    dataSource={users.items}
                    columns={[
                        { title: "Họ Tên", dataIndex: "name", sorter: true },
                        {
                            useranme: "Tài khoản",
                            dataIndex: "username",
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
                                            {canEdit && (
                                                <a
                                                    className="text-blue-400"
                                                    onClick={() =>
                                                        navigate(
                                                            "/user/edit/" +
                                                                record.id
                                                        )
                                                    }
                                                >
                                                    Cập nhật
                                                </a>
                                            )}
                                            {canDelete && (
                                                <Popconfirm
                                                    title="Bạn chắc chắn chứ?"
                                                    onConfirm={() =>
                                                        remove(record.id)
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
            {showCreate && <Create show onClose={() => setShowCreate(false)} />}
        </div>
    );
};

export default UserPage;
