import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const updateRating  = async (initName, rating) => {
  try {
    const res = await fetch(`/api/admin/block`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        "name": initName,
        "rating": rating
      }),
    });
    const res_data = await res.json();
    if (res_data.success) {
      toast.success('操作成功!');
    } else {
      toast.error('操作失败!');
    }
  } catch (error) {
    toast.error(error.message);
  }
};

const Switcher = ({ initialChecked, initName }) => {
  const [isChecked, setIsChecked] = useState(initialChecked === 3);
  // const isDisabled = initialChecked > 3;
  // console.log(initName);
  const isDisabled = initName.startsWith('/file') || initName.startsWith('/cfile');

  useEffect(() => {
    setIsChecked(initialChecked === 3);
  }, [initialChecked]);

  const handleCheckboxChange = async () => {
    // console.log(isDisabled);
    if (!isDisabled) return;

    const newRating = isChecked ? 1 : 3;
    await updateRating(initName, newRating);
    setIsChecked(!isChecked);
  };




  return (
    <label className="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
      <input
        type="checkbox"
        name="autoSaver"
        className="sr-only"
        checked={isChecked}
        onChange={handleCheckboxChange}
        disabled={!isDisabled}
      />
      <span
        className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-blue-600' : 'bg-[#CCCCCE]'}`}
      >
        <span
          className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''}`}
        ></span>
      </span>

      {/* <span className="label flex items-center text-sm font-medium text-black">
               <span className="pl-1"> {isChecked ? 'On' : 'Off'} </span>
      </span> */}
    </label>
  );
};

export default Switcher;
