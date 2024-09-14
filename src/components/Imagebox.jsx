import React, { useState, useCallback, useRef, useEffect } from 'react';

const ImageModal = ({ selectedImageIndex, setSelectedImageIndex, data }) => {
  
  const [imgSize, setImgSize] = useState(0.5); // 初始比例设为 1

  const handleIncreaseSize = () => {
    setImgSize((prevSize) => Math.min(prevSize + 0.1, 2)); // 最大缩放比例为 2
  };

  const handleDecreaseSize = () => {
    setImgSize((prevSize) => Math.max(prevSize - 0.1, 0.5)); // 最小缩放比例为 0.5
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const getImgUrl = (url) => {
    return url.startsWith("/file/") || url.startsWith("/cfile/") ? `${origin}/api${url}` : url;
  };

  const handleCloseImage = useCallback(() => {
    setSelectedImageIndex(null);
  }, [setSelectedImageIndex]);

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data.length - 1));
  }, [setSelectedImageIndex, data.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prevIndex) => (prevIndex < data.length - 1 ? prevIndex + 1 : 0));
  }, [setSelectedImageIndex, data.length]);



  if (selectedImageIndex === null) return null;

  return (
    <div className='flex flex-row justify-center items-center'>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
        <div className=" rounded-lg relative overflow-hidden"
        style={{ transform: `scale(${imgSize})` }}
        >

          <div className={`bg-white rounded-lg relative overflow-hidden  `}
          
          >

            <img
              src={getImgUrl(data[selectedImageIndex].url)}
              alt="Selected"
              className="object-cover w-full h-auto rounded-lg"
            />

          </div>



        </div>
      </div>

      <div className=" fixed inset-x-0 bottom-0 mb-[50px] h-[50px]   w-full  flex  z-50 justify-center items-center ">
        <button
          className="bg-gray-700 text-white rounded-full hover:text-red-800 w-8 h-8 flex items-center justify-center mx-2"
          onClick={handlePrevImage}
        >
          &#9664;
        </button>

        <button
              className=" bg-gray-700 w-8 h-8 z-10  text-white hover:text-red-800"
              onClick={handleCloseImage}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>

        </button>
        <button
          className="bg-gray-700 text-white rounded-full w-8 h-8 hover:text-red-800 flex items-center justify-center mx-2"
          onClick={handleNextImage}
        >
          &#9654;
        </button>


        {/* 增加缩放按钮 */}
        <button
          className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-2"
          onClick={handleIncreaseSize}
        >
          +
        </button>
        <button
          className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-2"
          onClick={handleDecreaseSize}
        >
          -
        </button>

      </div>
    </div>
  );
};

export default ImageModal;
