'use client'
import { signOut } from "next-auth/react"
import Table from "@/components/Table"
import { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from "react-toastify";
import Link from 'next/link'
// import { toast } from "react-toastify";

const devdata = {
  "code": 200,
  "success": true,
  "message": "success",
  "data": [
      {
          "id": 49155,
          "url": "https://openai-75050.gzc.vod.tencent-cloud.com/openaiassets_64d77b7cc4f54f588be7518f65b406d2_2579861724058117817.png",
          "referer": "https://img.131213.xyz/",
          "ip": "58.216.163.106",
          "rating": 7,
          "total": 1,
          "time": "2024年8月19日 17:01:58"
      },
      {
          "id": 49154,
          "url": "https://openai-75050.gzc.vod.tencent-cloud.com/openaiassets_248fac587027b77c8fa10eaf8007e197_2579861724058044438.png",
          "referer": "https://img.131213.xyz/",
          "ip": "58.216.163.106",
          "rating": 7,
          "total": 1,
          "time": "2024年8月19日 17:00:44"
      },
      {
          "id": 49153,
          "url": "/file/ce6f6247666dbe27a10ca.png",
          "referer": "https://img.131213.xyz/",
          "ip": "58.216.163.106",
          "rating": 1,
          "total": 1,
          "time": "2024年8月19日 17:00:35"
      },
      {
          "id": 49152,
          "url": "/file/572677e0307a08899e095.jpg",
          "referer": "https://img.131213.xyz/",
          "ip": "163.123.195.138",
          "rating": 2,
          "total": 24,
          "time": "2024年8月19日 16:57:05"
      },
      {
          "id": 49151,
          "url": "https://openai-75050.gzc.vod.tencent-cloud.com/openaiassets_e26433e228273523cf0c0bbfd048db40_2579861724055572395.png",
          "referer": "https://img.131213.xyz/",
          "ip": "58.216.163.106",
          "rating": 7,
          "total": 1,
          "time": "2024年8月19日 16:19:32"
      },
      {
          "id": 49150,
          "url": "https://openai-75050.gzc.vod.tencent-cloud.com/openaiassets_0bf05084f7ab9cc0eb6cdbbc91b19db8_2579861724055469107.png",
          "referer": "https://img.131213.xyz/",
          "ip": "58.216.163.106",
          "rating": 7,
          "total": 1,
          "time": "2024年8月19日 16:17:49"
      },
      {
          "id": 49149,
          "url": "/file/5a27a8609f601f74f1305.png",
          "referer": "https://img.131213.xyz/",
          "ip": "58.216.163.106",
          "rating": 1,
          "total": 1,
          "time": "2024年8月19日 16:17:42"
      },
      {
          "id": 49148,
          "url": "/file/23243869a508230951d76.jpg",
          "referer": "https://img.131213.xyz/",
          "ip": "113.248.82.37",
          "rating": 1,
          "total": 15,
          "time": "2024年8月19日 16:07:24"
      },
      {
          "id": 49147,
          "url": "/file/9a3d778213fe4226ef76a.png",
          "referer": "https://img.131213.xyz/",
          "ip": "58.216.163.106",
          "rating": 1,
          "total": 11,
          "time": "2024年8月19日 15:27:17"
      },
      {
          "id": 49146,
          "url": "/file/43bc7df1048a783a5a804.mp4",
          "referer": "https://img.131213.xyz/",
          "ip": "87.120.204.153",
          "rating": -1,
          "total": 3,
          "time": "2024年8月19日 15:08:33"
      }
  ],
  "page": 0,
  "total": 40097
}


export default function Admin() {
  const [listData, setListData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTotal, setSearchTotal] = useState(0); // 初始化为0，因为初始时还没有搜索结果
  const [inputPage, setInputPage] = useState(1);
  const [view, setView] = useState('list'); // 'list' 或 'log'，默认为 'list'
  const [searchQuery, setSearchQuery] = useState('');



  const getListdata = useCallback(async (page) => {
    try {
      // const res = await fetch(`/api/admin/${view}`, {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json',
      //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      //   },
      //   body: JSON.stringify({
      //     page: (page - 1),
      //     query: searchQuery, // 传递搜索查询
      //   })
      // })
      const res_data = devdata
      // const res_data = await res.json()
      if (!res_data?.success) {
        toast.error(res_data.message)
      } else {
        setListData(res_data.data)
        const totalPages = Math.ceil(res_data.total / 10);
        setSearchTotal(totalPages);
      }

    } catch (error) {
      toast.error(error.message)
    }

  })


  useEffect(() => {
    getListdata(currentPage)
  }, [currentPage, view]);

  // 分页控制按钮
  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage > searchTotal) { // 检查下一页是否在总页数范围内
      toast.error('当前已为最后一页！')
    }
    if (nextPage <= searchTotal) { // 检查下一页是否在总页数范围内
      setCurrentPage(nextPage);
      setInputPage(nextPage)
    }

  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 1) { // 检查上一页是否在总页数范围内
      setCurrentPage(prevPage);
      setInputPage(prevPage)
      // searchVideo(prevPage);
    }

  };


  const handleJumpPage = () => {
    const page = parseInt(inputPage, 10);
    if (!isNaN(page) && page >= 1 && page <= searchTotal) {
      setCurrentPage(page);
    } else {
      toast.error('请输入有效的页码！');
    }
    // setInputPage(""); // 清空输入框
  };

  const handleViewToggle = () => {
    setView(view === 'list' ? 'log' : 'list');
    setCurrentPage(1); // 切换视图时重置到第一页
  };


  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    getListdata(1);
  };

  return (
    <>
      <div className="overflow-auto h-full flex w-full min-h-screen flex-col items-center justify-between">
        <header className="fixed top-0 h-[50px]  left-0 w-full border-b bg-white flex z-50 justify-center items-center">
          <div className="flex justify-between items-center w-full max-w-4xl px-4">
            <button className='text-white px-4 py-2  transition ease-in-out delay-150 bg-blue-500 hover:scale-110 hover:bg-indigo-500 duration-300  rounded '
              onClick={handleViewToggle}>
              切换到 {view === 'list' ? '日志页' : '数据页'}
            </button>
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded p-2 w-40 mr-2"
                placeholder="搜索"
              />
              <button type="submit" className="text-white px-4 py-2 transition ease-in-out delay-150 bg-blue-500 hover:scale-110 hover:bg-indigo-500 duration-300 rounded">
                搜索
              </button>
            </form>
          </div>
          <Link href="/"  className="hidden sm:flex"> <button className="px-4 py-2 mx-2 w-28  sm:w-28 md:w-20 lg:w-16 xl:w-16  2xl:w-20 bg-blue-500 text-white rounded ">主页</button></Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="px-4 py-2 mx-2 w-28  sm:w-28 md:w-20 lg:w-16 xl:w-16  2xl:w-20 bg-blue-500 text-white rounded ">登出</button>
        </header>

        <main className="my-[60px] w-9/10  sm:w-9/10 md:w-9/10 lg:w-9/10 xl:w-3/5 2xl:w-full">

          <Table data={listData} />

        </main>
        <div className="fixed inset-x-0 bottom-0 h-[50px]  w-full  flex  z-50 justify-center items-center bg-white ">
          <div className="pagination mt-5 mb-5 flex justify-center items-center">
            <button className=' text-xs sm:text-sm transition ease-in-out delay-150 bg-blue-500  hover:scale-110 hover:bg-indigo-500 duration-300p-2 p-2 rounded mr-5' onClick={handlePrevPage} disabled={currentPage === 1}>
              上一页
            </button>
            <span className="text-xs sm:text-sm">第 {`${currentPage}/${searchTotal}`} 页</span>
            <button className='text-xs sm:text-sm transition ease-in-out delay-150 bg-blue-500  hover:scale-110 hover:bg-indigo-500 duration-300 p-2 rounded ml-5' onClick={handleNextPage}>
              下一页</button>
            <div className="ml-5 flex items-center">
              <input
                type="number"
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                className="border rounded p-2 w-20"
                placeholder="页码"
              />
              <button className='text-xs sm:text-sm transition ease-in-out delay-150 bg-blue-500 hover:scale-110 hover:bg-indigo-500 duration-300 p-2 rounded ml-2' onClick={handleJumpPage}>
                跳转
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>

  )
}