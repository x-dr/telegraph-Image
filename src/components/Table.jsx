
import { useState } from "react";
import Switcher from '@/components/SwitchButton';
import { ToastContainer, toast } from "react-toastify";
import React, { useRef } from 'react';
import TooltipItem from '@/components/Tooltip';

export default function Table({ data }) {
    const [selectedImage, setSelectedImage] = useState(null); // 添加状态用于跟踪选中的放大图片
    const [selectedUrl, setSelectedUrl] = useState(null); // 添加状态用于跟踪选中的放大图片
    const [modalData, setModalData] = useState(null); // 添加状态用于跟踪弹窗数据
    const modalRef = useRef(null);


    const handleClickOutside = (e) => {
        // console.log("11");
        console.log(modalRef.current.contains(e.target));
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            // console.log("11");
            setModalData(null);
        }
    };

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // 处理点击图片放大
    const handleImageClick = (index) => {
        // URL.createObjectURL(selectedFiles[index])
        // console.log(index);
        setSelectedImage(index);
    };

    // 处理关闭放大图片
    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    const getImgUrl = (url) => {
        if (url.startsWith("/file/")) {

            return `${origin}/api${url}`
        } else {
            return url
        }
    }
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

    return (
        <div className="overflow-auto">
            <table className="min-w-full bg-white  items-center justify-between ">
                <thead >
                    <tr className="sticky top-0 bg-gray-100 z-20">
                        <th className="sticky left-0 z-10 py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">preview</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">name</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">time</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">referer</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">ip</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">PV</th>
                        <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">rating</th>
                        <th className="sticky  right-0 z-10 py-2 px-4 border-b border-gray-200 bg-gray-100  text-center text-sm font-semibold text-gray-600">限制访问</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index.id}>
                            <td className="w-20 h-20 sticky left-0 z-10   py-2 px-4 border-b border-gray-500 bg-white text-sm text-gray-700">
                                <img
                                    src={getImgUrl(item.url)}
                                    alt="Selected"
                                    className="w-full h-full object-cover"
                                    onClick={() => handleImageClick(getImgUrl(item.url))}
                                />
                            </td>
                            <td onClick={() => handleNameClick(item)} className="text-center py-2 px-4 border-b border-gray-200 text-sm text-gray-700 truncate max-w-48">
                                {item.url}
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
                                <Switcher initialChecked={item.rating} initName={item.url} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseImage}>
                    <div className="relative">
                        <button
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={handleCloseImage}
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage}
                            alt="Selected"
                            width={500}
                            height={500}
                        />
                    </div>
                </div>
            )}


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
