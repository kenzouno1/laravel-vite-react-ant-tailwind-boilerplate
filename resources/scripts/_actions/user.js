import { useSetRecoilState,useRecoilState, useResetRecoilState } from 'recoil';

import { accountAtom, usersAtom } from '@/_state';
import { useNavigate } from 'react-router';
export { useUserActions };

function useUserActions() {
    const setUsers = useSetRecoilState(usersAtom);
    const [profile,setProfile] = useRecoilState(accountAtom);
    const navigate = useNavigate();
    return {
        login,
        logout,
        getList,
        show,
        update,
        destroy,
        resetUsers: useResetRecoilState(usersAtom),
    }

    function login(body) {
        return axios.post(`/api/login`, body)
            .then(({ data }) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem("access_token", data.access_token);
                window.axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("access_token");
                navigate("/")
            });
    }

    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        localStorage.removeItem('access_token');
        setProfile(null);
        navigate("/login")
    }

    function show(id) {
        return axios.get("/api/users/" + id);
    }

    function getList(params) {
        return axios.get("/api/users",{params}).then(({ data }) => setUsers({
            items: data,
            loaded: true
        }));
    }

    function update(id, params) {
        return axios.put(`/api/users/${id}`, params)
            .then(({ data }) => {

                setUsers(users => {
                    const index = users.items.findIndex(x => x.id == id);
                    if (index >= 0) {
                        users.items[index] = data;
                    }
                    return {...users}
                })

                if (id === profile?.id) {
                    setProfile({
                        ...profile,
                        ...data
                    });
                }
                return data;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function destroy(id) {
        return axios.delete(`/api/users/${id}`)
            .then(() => {
                // remove user from list after deleting
                setUsers(users => ({
                    items: [
                        ...users.items.filter(x => x.id !== id)
                    ]
                }))
            });
    }
}