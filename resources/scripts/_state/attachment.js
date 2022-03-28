import { atom, selector } from 'recoil';

const attachmentsAtom = atom({
    key: 'attachments',
    default: {
        loaded: false,
        items: []
    }
});

//selector items
const attachmentItems = selector({
    key: 'attachmentItems',
    get: ({ get }) => {
        const attachments = get(attachmentsAtom);
        return attachments.items;
    },
    set: ({ set ,get}, newValue) => {
        return set(attachmentsAtom,{
            ...get(attachmentsAtom),
            items:[...newValue]
        });
    }
});

export {
    attachmentsAtom,
    attachmentItems
};

