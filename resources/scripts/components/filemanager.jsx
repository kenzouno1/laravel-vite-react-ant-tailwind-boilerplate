import {
    Modal,
    Upload,
    message,
    Image,
    Row,
    Col,
    Popover,
    Checkbox,
    Spin,
    Progress,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useWindowDimensions } from "@/lib/hook";
import styled from "styled-components";
import { useState, useEffect } from "react";
const { Dragger } = Upload;
import { useAttachmentActions } from "@/_actions";
import { attachmentsAtom } from "@/_state";
import { useRecoilValue } from "recoil";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const FileManager = ({
    show,
    onRequestClose,
    onSelectFile,
    options = {
        multiple: true,
    },
    ...props
}) => {
    const { width } = useWindowDimensions();
    const attachmentActions = useAttachmentActions();
    const [loading, setLoading] = useState(false);
    const [selecteds, setSelecteds] = useState([]);
    const [uploading, setUploading] = useState({});
    const [deletings, setDeletings] = useState([]);
    const attachment = useRecoilValue(attachmentsAtom);

    const { multiple, folder } = options;

    const loadData = async () => {
        setLoading(true);
        await attachmentActions.getList();
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const onSelectImage = (file) => {
        if (selecteds.includes(file.id)) {
            setSelecteds([...selecteds.filter((x) => x !== file.id)]);
        } else {
            if (multiple) {
                setSelecteds([...selecteds, file.id]);
            } else {
                setSelecteds([file.id]);
            }
        }
    };

    const uploadProps = {
        name: "file",
        multiple: true,
        showUploadList: false,
        customRequest: async (options) => {
            const { onSuccess, onError, file, onProgress } = options;
            const fmData = new FormData();

            fmData.append("file", file);
            if (folder) fmData.append("folder", folder);
            try {
                setUploading({
                    ...uploading,
                    [file.uid]: 0,
                });
                var res = await attachmentActions.upload(
                    fmData,
                    {
                        onUploadProgress: (event) => {
                            const percent = Math.floor(
                                (event.loaded / event.total) * 100
                            );
                            setUploading({
                                ...uploading,
                                [file.uid]: percent,
                            });
                            onProgress({
                                percent: (event.loaded / event.total) * 100,
                            });
                        },
                    },
                    file.uid
                );

                delete uploading[file.uid];

                setUploading({
                    ...uploading,
                });
                return onSuccess(res.url);
            } catch (err) {
                console.log("Eroor: ", err);
                onError({ err });
            }
        },
    };

    //destroy image
    const destroyImage = async (id) => {
        setDeletings([...deletings, id]);
        await attachmentActions.destroy(id);
        setDeletings([...deletings.filter((x) => x !== id)]);
    };

    return (
        <Modal
            okButtonProps={{
                disabled: selecteds.length == 0,
            }}
            onOk={() => {
                onSelectFile(
                    attachment.items.filter((x) => selecteds.includes(x.id))
                );
                onRequestClose();
            }}
            visible={show}
            onCancel={onRequestClose}
            title="Quản lý file"
            width={width - 60}
            centered
        >
            <FileList className="bg-gray-100 relative">
                {loading && (
                    <Spin
                        size="large"
                        className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                )}

                <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
                    <Dragger {...uploadProps}>
                        {attachment.loaded && attachment.items.length == 0 && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Chưa có dữ liệu.Bạn có thể kéo thả file vào
                                    đây để upload
                                </p>
                            </div>
                        )}
                    </Dragger>
                </div>
                <Scrollbars style={{ height: 500 }}>
                    <div className="overflow-x-hidden px-4">
                        <Row gutter={16}>
                            {attachment.items.map((item) => (
                                <Col className="my-2" span={4} key={item.id}>
                                    <Popover
                                        content={<PopoverContent {...item} />}
                                    >
                                        <div
                                            style={{ minHeight: 210 }}
                                            className="relative border h-full border-gray-200 z-20 bg-white"
                                        >
                                            {deletings.includes(item.id) && (
                                                <Spin
                                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -transate-y-1/2 z-30"
                                                    size="large"
                                                />
                                            )}
                                            {uploading[item.id] && (
                                                <Progress
                                                    percent={item.percent}
                                                    className="absolute top-1/2 left-3 right-3 -translate-y-1/2 w-11/12"
                                                />
                                            )}

                                            <FontAwesomeIcon
                                                size="1x"
                                                onClick={() =>
                                                    destroyImage(item.id)
                                                }
                                                className="text-red-500 absolute top-2 right-2 z-30 cursor-pointer"
                                                icon="fas fa-minus-circle"
                                            />
                                            <Image src={item.url} />
                                            <div
                                                onClick={() =>
                                                    onSelectImage(item)
                                                }
                                                className="p-3 flex cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={selecteds.includes(
                                                        item.id
                                                    )}
                                                    className=" mr-auto"
                                                />
                                                <p className="px-2 text-center block flex-1 overflow-x-hidden whitespace-nowrap">
                                                    {item.name}
                                                </p>
                                            </div>
                                        </div>
                                    </Popover>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Scrollbars>
            </FileList>
        </Modal>
    );
};

export default FileManager;

//convert byte to size
function convertByteToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

const PopoverContent = ({ name, size, url }) => {
    url = location.origin + "/" + url;
    return (
        <div>
            <p>Tên file: {name}</p>
            <p>Kích thước: {convertByteToSize(size)}</p>
            <p>
                Url:
                <a href={url} target="_blank">
                    {url}
                </a>
            </p>
        </div>
    );
};

const FileList = styled.div``;
