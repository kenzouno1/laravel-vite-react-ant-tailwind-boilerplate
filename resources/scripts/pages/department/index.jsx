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
import CreateRole from "./create-edit";
import { userCan } from "@/_state";
import { useRecoilValue } from "recoil";
import { departmentAtom } from "@/_state";
import { useDepartmentActions } from "@/_actions";

const DepartmentPage = ({ ...props }) => {
    const actions = useDepartmentActions();
    const navigate = useNavigate();
    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const deparment = useRecoilValue(departmentAtom);

    const canCreate = useRecoilValue(userCan("department.create"));
    const canDelete = useRecoilValue(userCan("department.delete"));
    const canEdit = useRecoilValue(userCan("department.update"));

    const loadData = async () => {
        setLoading(true);
        await actions.getList();
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const remove = async (id) => {
        setLoadingRow(id);
        await actions.destroy(id);
        setLoadingRow(null);
    };
    return (
        <div>
            <PageHeader
                title={"Phòng ban"}
                extra={
                    canCreate && (
                        <Button
                            onClick={() => navigate("/department/create")}
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Thêm phòng ban
                        </Button>
                    )
                }
            />
            <Card>
                <Table
                    dataSource={deparment.items}
                    columns={[
                        {
                            title: "Tên Phòng ban",
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
                                            {canDelete && (
                                                <a
                                                    className="text-blue-400"
                                                    onClick={() =>
                                                        navigate(
                                                            "/department/edit/" +
                                                                record.id
                                                        )
                                                    }
                                                >
                                                    Cập nhật
                                                </a>
                                            )}
                                            {canEdit && (
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
            {showCreate && (
                <CreateRole show onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
};

export default DepartmentPage;
