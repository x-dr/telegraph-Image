import React from "react";

const TooltipItem = ({ children, tooltipsText, position }) => {
  return (
    <div className="">
      <div className="">
        <div className="group relative inline-block">
          <button className="inline-flex rounded">
            {children}
          </button>
          <div
            className={` ${
              (position === "right" &&
                `absolute bg-slate-200 left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-primary px-4 py-[6px] text-sm font-semibold  opacity-0 group-hover:opacity-100`) ||
              (position === "top" &&
                `absolute bg-slate-200 bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-4 py-[6px] text-sm font-semibold  opacity-0 group-hover:opacity-100`) ||
              (position === "left" &&
                `absolute bg-slate-200 right-full top-1/2 z-20 mr-3 -translate-y-1/2 whitespace-nowrap rounded bg-primary px-4 py-[6px] text-sm font-semibold opacity-0 group-hover:opacity-100`) ||
              (position === "bottom" &&
                `absolute bg-slate-200 left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-4 py-[6px] text-sm font-semibold  opacity-0 group-hover:opacity-100`)
            }`}
          >
            <span
              className={` ${
                (position === "right" &&
                  `absolute  left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-sm bg-primary`) ||
                (position === "top" &&
                  `absolute  bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-primary`) ||
                (position === "left" &&
                  `absolute  right-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-sm bg-primary`) ||
                (position === "bottom" &&
                  `absolute  left-1/2 top-[-3px] -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-primary`)
              } `}
            ></span>
            {tooltipsText}
          </div>
        </div>
      </div>
    </div>
  );
};


export default TooltipItem;