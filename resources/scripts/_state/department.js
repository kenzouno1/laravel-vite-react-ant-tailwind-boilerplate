import { atom } from 'recoil';

export const departmentAtom = atom({
    key: 'roles',
    default: {
        items:[],
        loaded:false
    }
});

