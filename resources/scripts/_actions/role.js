import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { rolesAtom, permissionAtom } from '@/_state';
export { useRoleActions };

function useRoleActions() {
    const setRoles = useSetRecoilState(rolesAtom);
    const setPermission = useSetRecoilState(permissionAtom);
    return {
        getList,
        search,
        show,
        update,
        destroy,
        create,
        getPermission,
        reset: () => {
            useResetRecoilState(rolesAtom)
        },
    }

    function getList() {
        return axios.get("/api/roles").then(({ data }) => setRoles({
            items: data,
            loaded: true
        }));
    }
    function search(filter) {
        return axios.get("/api/roles", {
            params: filter
        });
    }
    function getPermission() {
        return axios.get("/api/permissions").then(({ data }) => setPermission(data));
    }
    function show(id) {
        return axios.get("/api/roles/" + id);
    }
    function create(data) {
        return axios.post("/api/roles", data).then(({ data }) => {
            setRoles(roles => ({
                ...roles,
                items: [
                    ...roles.items,
                    data
                ]
            }))
        })
    }
    function update(id, data) {
        return axios.put("/api/roles/" + id, data).then(({ data }) => {

            setRoles(roles => {
                const index = roles.items.findIndex(x => x.id == id);
                if (index >= 0) {
                    roles.items[index] = data;
                }
                return [...roles]
            })

        })
    }
    function destroy(id) {
        return axios.delete("/api/roles/" + id).then(res => {
            setRoles(roles => ({
                ...roles,
                items: [
                    ...roles.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}