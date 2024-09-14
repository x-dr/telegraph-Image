import { useState, useEffect } from "react";
import Switcher from '@/components/SwitchButton';
import { ToastContainer, toast } from "react-toastify";
import React, { useRef } from 'react';
import TooltipItem from '@/components/Tooltip';
import ImageModal from  "@/components/Imagebox"



export default function Table({ data: initialData = [] }) {
    const [data, setData] = useState(initialData); // 初始化状态
    // const [selectedImage, setSelectedImage] = useState(null); 
    // const [selectedUrl, setSelectedUrl] = useState(null); 
    const [modalData, setModalData] = useState(null); 
    const modalRef = useRef(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const imageRefs = useRef([]);



    useEffect(() => {
        setData(initialData); // 更新数据
    }, [initialData]);

    const handleClickOutside = (e) => {
        // console.log("11");
        console.log(modalRef.current.contains(e.target));
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            // console.log("11");
            setModalData(null);
        }
    };

    const origin = typeof window !== 'undefined' ? window.location.origin : '';



    // 图片点击事件
    const handleImageClick = (fileUrl, index) => {
        // console.log(index);

        setSelectedImageIndex(index);
    };

    // 关闭图片
    const handleCloseImage = (e) => {
        if (e.target.className.includes('modal-overlay')) {
            setSelectedImageIndex(null);
        }
    };


    // 切换到前一张图片
    const handlePrevImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data.length - 1));
    };

    // 切换到下一张图片
    const handleNextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex < data.length - 1 ? prevIndex + 1 : 0));
    };

    // 键盘左右切换图片
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            handlePrevImage();
        } else if (e.key === 'ArrowRight') {
            handleNextImage();
        }
    };


    // 键盘事件监听器
    useEffect(() => {
        if (selectedImageIndex !== null) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImageIndex]);

    const getImgUrl = (url) => {
        return url.startsWith("/file/") || url.startsWith("/cfile/") ? `${origin}/api${url}` : url;
    };

    const handleNameClick = (item) => {
        setModalData(item);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };



    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`链接复制成功`);
        });
    };



    const deleteItem = async (initName) => {
        try {
            const res = await fetch(`/api/admin/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: initName,
                }),
            });
            const res_data = await res.json();
            if (res_data.success) {
                toast.success('删除成功!');
                setData(prevData => prevData.filter(item => item.url !== initName));
            } else {
                toast.error(res_data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    const handleDelete = async (initName) => {
        const confirmed = window.confirm('你确定要删除这个项目吗？');
        if (confirmed) {
            await deleteItem(initName);
        }
    };



    function getLastSegment(url) {
        const lastSlashIndex = url.lastIndexOf('/');
        return url.substring(lastSlashIndex + 1);
    }
    
    const renderFile = (fileUrl, index) => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const ismyorigin = fileUrl.startsWith(origin);
        const _url = getLastSegment(fileUrl);
        const getFileExtension = (url) => {
            const parts = url.split('.');
            return parts.length > 1 ? parts.pop().toLowerCase() : '';
        };
        const fileExtension = getFileExtension(_url);
        let resolvedFileExtension = fileExtension;
        if (!fileExtension && ismyorigin) {
            try {
                const response = fetch(fileUrl, { method: 'HEAD' });
                const mimeType = response.headers.get('Content-Type') || '';
                resolvedFileExtension = getFileExtensionFromMimeType(mimeType);
            } catch (error) {
                console.error('Error fetching file:', error);
                resolvedFileExtension = "!";
            }
        }

        const imageExtensions = [
            'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp',
            'svg', 'ico', 'heic', 'heif', 'raw', 'psd', 'ai', 'eps'
        ];

        const videoExtensions = [
            'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg',
            'ogv', 'm4v', '3gp', '3g2', 'mpg', 'mpeg', 'mxf', 'vob'
        ];
        if (imageExtensions.includes(resolvedFileExtension)) {
            return (
                <img
                    key={`image-${index}`}
                    src={fileUrl}
                    alt={`Uploaded ${index}`}
                    className="w-full h-full object-cover"
                    onClick={() => handleImageClick(fileUrl, index)}
                />
            );
        }
        else if (videoExtensions.includes(resolvedFileExtension)) {
            return (
                <video
                    key={`video-${index}`}
                    src={fileUrl}
                    className="w-full h-full object-cover"
                    controls
                    onClick={() => handleImageClick(fileUrl, index)}
                >
                    Your browser does not support the video tag.
                </video>
            );
        }
        else {
            return (
                <a
                    key={`file-${index}`}
                    href={fileUrl}
                    className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>Unsupported file type</span>
                </a>
            );
        }
    };




    return (
        <div className="mx-2">
            <table className="min-w-full bg-white  items-center justify-between ">
                <thead >
                    <tr className="sticky top-0 bg-gray-100 z-20">
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">name</th>
                        <th className="sticky left-0 z-10 py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">preview</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">time</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">referer</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">ip</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">PV</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">rating</th>
                        <th className="sticky  right-0 z-10 py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">限制访问</th>
                    </tr>
                </thead>
                <tbody >
                    {data.map((item, index) => (
                        <tr key={index}>

                            <td onClick={() => handleNameClick(item)} className="text-center py-2 px-4 border-b border-gray-200 text-sm text-gray-700 truncate max-w-48">
                                {item.url}
                            </td>
                            <td
                                className="w-20 h-20 sticky left-0 z-10   py-2 px-4 border-b border-gray-500 bg-white text-sm text-gray-700"
                            >
                                {renderFile(getImgUrl(item.url), index)}

                            </td>
                            <td className="text-center py-2 px-4 border-b border-gray-200 text-sm text-gray-700 max-w-48">
                                {item.time}
                            </td>
                            <td className="text-center py-2 px-4 border-b border-gray-200 text-sm text-gray-700 max-w-48 break-all">
                                <TooltipItem tooltipsText={item.referer} position="bottom" >{item.referer}</TooltipItem>
                            </td>
                            <td className="text-center py-2 px-4 border-b border-gray-200 text-sm text-gray-700 max-w-48 ">
                                <TooltipItem tooltipsText={item.ip} position="bottom" >{item.ip}</TooltipItem>
                            </td>
                            <td className="text-center py-2 px-4 border-b border-gray-200 text-sm text-gray-700 max-w-2 ">{item.total}</td>
                            <td className="text-center py-2 px-4 border-b border-gray-200 text-sm text-gray-700 max-w-2 ">{item.rating}</td>
                            <td className="sticky  right-0 z-10 bg-white text-center py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                                <div className="flex flex-row justify-center">
                                    <Switcher initialChecked={item.rating} initName={item.url} />
                                    <button
                                        onClick={() => {
                                            handleDelete(item.url)
                                        }}
                                        className="ml-2 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    >
                                        删除
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <ImageModal
                selectedImageIndex={selectedImageIndex}
                setSelectedImageIndex={setSelectedImageIndex}
                data={data}
            />
            {modalData && (
                <div onClick={handleClickOutside} className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center m-5 ">
                    <div className="fixed inset-0 bg-black opacity-75"></div>
                    <div ref={modalRef} className="bg-white rounded-lg flex-none flex flex-col h-1/2 relative w-9/10 sm:w-9/10 md:w-96 lg:w-120 xl:w-144 2xl:w-160">
                        <button className="absolute top-2 right-2 ring-2 text-red-600 hover:text-red-800" onClick={handleCloseModal}>
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className='flex flex-col  mt-10'>
                            {[
                                { text: getImgUrl(modalData.url), onClick: () => handleCopy(getImgUrl(modalData.url)) },
                                { text: `![${modalData.url}](${getImgUrl(modalData.url)})`, onClick: () => handleCopy(`![${modalData.name}](${getImgUrl(modalData.url)})`) },
                                { text: `<a href="${getImgUrl(modalData.url)}" target="_blank"><img src="${getImgUrl(modalData.url)}"></a>`, onClick: () => handleCopy(`<a href="${getImgUrl(modalData.url)}" target="_blank"><img src="${getImgUrl(modalData.url)}"></a>`) },
                                { text: `[img]${getImgUrl(modalData.url)}[/img]`, onClick: () => handleCopy(`[img]${getImgUrl(modalData.url)}[/img]`) },
                            ].map((item, i) => (
                                <input
                                    key={`input-${i}`}
                                    readOnly
                                    value={item.text}
                                    onClick={item.onClick}
                                    className="mx-2 px-3 my-1 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-800 focus:outline-none placeholder-gray-400"
                                />


                            ))}
                        </div>

                    </div>
                </div>


            )}

        </div>
    );
}
