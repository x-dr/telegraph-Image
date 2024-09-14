
import React, { useState, useCallback, useRef, useEffect } from 'react';

const ImageModal = ({ selectedImageIndex, setSelectedImageIndex, data }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedImageIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
      <div className=" rounded-lg relative overflow-hidden" ref={modalRef}>

        <div className='bg-white rounded-lg relative overflow-hidden scale-75'>
          <button
            className="absolute bg-red-500 z-10 top-2 right-2 ring-2 text-white hover:text-red-800"
            onClick={handleCloseImage}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={getImgUrl(data[selectedImageIndex].url)}
            alt="Selected"
            className="object-cover w-full h-auto rounded-lg"
          />

        </div>
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
          onClick={handlePrevImage}
        >
          &#9664;
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
          onClick={handleNextImage}
        >
          &#9654;
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
