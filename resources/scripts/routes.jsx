import React, { lazy } from "react";
import {
    DatabaseFilled,
    CodepenSquareFilled,
    QqCircleFilled,
} from "@ant-design/icons";
const DepartmentPage = lazy(() => import("@/pages/department"));

const DepartmentCreateEdit = lazy(() => import("@/pages/department/create-edit"));
const UserPage = lazy(() => import("@/pages/user"));
const UserCreateEdit = lazy(() => import("@/pages/user/create-edit"));
const routes = [
    {
        title: "Công cụ quản trị",
        icon: <QqCircleFilled />,
        path:"",
        childs: [
            {
                title: "Quản lý phòng ban",
                path: "department",
                component: DepartmentPage,
                childs: [
                    {
                        path: "create",
                        component: DepartmentCreateEdit,
                        title: "Thêm phòng ban",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: DepartmentCreateEdit,
                        title: "Cập nhật phòng ban",
                        hidden: true,
                    },
                ],
            },
            {
                title: "Quản người dùng",
                path: "user",
                component: UserPage,
                childs: [
                    {
                        path: "create",
                        component: UserCreateEdit,
                        title: "Thêm người dùng mới",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: UserCreateEdit,
                        title: "Cập nhật người dùng",
                        hidden: true,
                    },
                ],
            },
        ],
    },
];

export default routes;
