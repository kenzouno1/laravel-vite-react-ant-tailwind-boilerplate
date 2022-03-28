import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { accountAtom } from '@/_state';
export { useAccountActions };

function useAccountActions() {
    const setAccount = useSetRecoilState(accountAtom);
    return {
        getProfile,
        reset: useResetRecoilState(accountAtom),
    }

    function getProfile() {
        return axios.get("/api/account").then(({ data }) => setAccount(data));
    }

}