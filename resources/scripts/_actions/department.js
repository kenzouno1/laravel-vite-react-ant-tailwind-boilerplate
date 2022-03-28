import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { departmentAtom, permissionAtom } from '@/_state';
export { useDepartmentActions };

function useDepartmentActions() {
    const setDepartment = useSetRecoilState(departmentAtom);
    const setPermission = useSetRecoilState(permissionAtom);
    return {
        getList,
        show,
        update,
        search,
        destroy,
        create,
        getPermission,
        reset: () => {
            useResetRecoilState(departmentAtom)
        },
    }

    function getList() {
        return axios.get("/api/departments").then(({ data }) => setDepartment({
            items: data,
            loaded: true
        }));
    }
    function search(filter) {
        return axios.get("/api/departments",{
            params: filter
        });
    }
    function getPermission() {
        return axios.get("/api/permissions").then(({ data }) => setPermission(data));
    }
    function show(id) {
        return axios.get("/api/departments/" + id);
    }
    function create(data) {
        return axios.post("/api/departments", data).then(({ data }) => {
            setDepartment(department => ({
                ...department,
                items: [
                    ...department.items,
                    data
                ]
            }))
        })
    }
    function update(id, data) {
        return axios.put("/api/departments/" + id, data).then(({ data }) => {

            setDepartment(department => {
                const index = department.items.findIndex(x => x.id == id);
                if (index >= 0) {
                    department.items[index] = data;
                }
                return {...department}
            })

        })
    }
    function destroy(id) {
        return axios.delete("/api/departments/" + id).then(res => {
            setDepartment(department => ({
                ...department,
                items: [
                    ...department.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}