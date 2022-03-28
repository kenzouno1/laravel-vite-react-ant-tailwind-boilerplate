import { Card, Checkbox, Col, Form, Input, Modal, Row, Spin } from "antd";
import { useRoleActions } from "@/_actions";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { permissionAtom, userCan } from "@/_state";
import RoleSelect from "./select";

const labelMap = {
    create: "Thêm",
    update: "Cập nhật",
    delete: "Xoá",
    manage: "Quản lý",
};

const UpdateEditRole = ({ show, onRequestClose, model }) => {
    const roleActions = useRoleActions();
    const [caps, setCaps] = useState([]);
    const permissions = useRecoilValue(permissionAtom);
    const [form] = Form.useForm();
    const isEdit = !!model;

    const [saveLoading, setSaveLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSave = () => {};

    return (
        <Modal
            title={isEdit ? "Chỉnh sửa chức vụ" : "Thêm chức vụ"}
            onCancel={onRequestClose}
            onOk={onSave}
            centered
            visible={show}
            width={1000}
        >
            <Card title="Thông tin">
                <Form.Item
                    name="name"
                    label="Tên chức vụ"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên chức vụ",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="parent_id" label="Cấp dưới của">
                    <RoleSelect filter={{
                        department_id: model?.department_id,
                    }}/>
                </Form.Item>
                <Row gutter={20}>
                    {permissions.map((x) => (
                        <Col key={x.category} span={8}>
                            <Card
                                className="mb-3"
                                title={
                                    <div>
                                        <Checkbox
                                            className="mr-2"
                                            checked={x.caps.every((c) =>
                                                caps.includes(c)
                                            )}
                                            onChange={(e) =>
                                                setCaps(
                                                    e.target.checked
                                                        ? [
                                                              ...new Set([
                                                                  ...caps,
                                                                  ...x.caps,
                                                              ]),
                                                          ]
                                                        : [
                                                              ...caps.filter(
                                                                  (c) =>
                                                                      !x.caps.includes(
                                                                          c
                                                                      )
                                                              ),
                                                          ]
                                                )
                                            }
                                        />
                                        {x.category}
                                    </div>
                                }
                            >
                                {x.caps.map((cap) => (
                                    <div className="flex" key={cap}>
                                        <Checkbox
                                            className="mr-2"
                                            checked={caps.includes(cap)}
                                            onChange={(e) =>
                                                setCaps(
                                                    e.target.checked
                                                        ? [...caps, cap]
                                                        : [
                                                              ...caps.filter(
                                                                  (c) =>
                                                                      c != cap
                                                              ),
                                                          ]
                                                )
                                            }
                                        />
                                        <label>
                                            {labelMap[cap.split(".")[1]]}{" "}
                                            {x.category}
                                        </label>
                                    </div>
                                ))}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </Modal>
    );
};

export default UpdateEditRole;
