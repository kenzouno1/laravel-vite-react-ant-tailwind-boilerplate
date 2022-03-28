
import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { attachmentsAtom } from '@/_state';
export { useAttachmentActions };

function useAttachmentActions() {
    const setAttachments = useSetRecoilState(attachmentsAtom);

    return {
        getList,
        destroy,
        upload
    }

    function getList(params) {
        return axios.get("/api/attachments", {
            params

        }).then(({ data }) => {
            setAttachments({
                items: data.data,
                loaded: true
            })
        });
    }

    function upload(formData, options, uid) {
        setAttachments((attachments) => ({
            ...attachments,
            items: [...attachments.items, {
                id: uid,
            }],
        }))
        return axios.post('/api/attachments', formData, {
            headers: { "content-type": "multipart/form-data" },
            ...options
        }).then(({ data }) => {

            setAttachments((attachments) => {
                let items = [...attachments.items]
                const index =items.findIndex(item => item.id === uid);
                if (index >= 0)
                   items[index] = data;
                else
                   items.push(data);
                return {
                    ...attachments,
                    items:[...items]
                }
            })
            return data;
        })
    }
    function destroy(id) {
        return axios.delete("/api/attachments/" + id).then(x => {
            setAttachments(attachments => ({
                ...attachments,
                items: [...attachments.items.filter(x => x.id != id)]
            }))
        });
    }
}