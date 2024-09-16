import React, { useState, useEffect } from 'react';

const FullScreenIcon = (props) => {
  const [fullscreen, setFullscreen] = useState(false);

  // 添加全屏变化监听，并在组件卸载时移除
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 渲染SVG图标，fullscreen控制图标路径
  return (
    <svg
      className="PhotoView-Slider__toolbarIcon"
      fill="white"
      width="44"
      height="44"
      viewBox="0 0 768 768"
      {...props}
    >
      <path
        d={
          fullscreen
            ? 'M511.5 256.5h96v63h-159v-159h63v96zM448.5 607.5v-159h159v63h-96v96h-63zM256.5 256.5v-96h63v159h-159v-63h96zM160.5 511.5v-63h159v159h-63v-96h-96z'
            : 'M448.5 160.5h159v159h-63v-96h-96v-63zM544.5 544.5v-96h63v159h-159v-63h96zM160.5 319.5v-159h159v63h-96v96h-63zM223.5 448.5v96h96v63h-159v-159h63z'
        }
      />
    </svg>
  );
};

export default FullScreenIcon;
