async function isVideoPlaying(videoElem, tickCount = 5) {

      /**
       * 获取video元素当前帧数据
       */
      function getFrame() {
        let canvas = document.createElement('canvas');
        let videoStyle = getComputedStyle(videoElem);
        canvas.width = parseInt(videoStyle.width);
        canvas.height = parseInt(videoStyle.height);
        let ctx = canvas.getContext('2d');
        ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // 缩放系数，现将图片数据缩小10倍
        const factor = 10;
        // 筛选像素点
        let oldUint32Array = new Uint32Array(imageData.data.buffer);
        let selectedUint32Array = [];
        let newWidth = Math.ceil(imageData.width / factor);
        let newHeight = Math.ceil(imageData.height / factor);
        for (let i = 0; i < newHeight; i++) {
          selectedUint32Array[i] = [];
          for (let j = 0; j < newWidth; j++) {
            // 将现在矩阵中的坐标点对应到原数据
            let row = i * factor;
            let col = j * factor;
            selectedUint32Array[i].push(
              oldUint32Array[row * imageData.width + col]
            );
          }
        }
        return [].concat(...selectedUint32Array);
      }

      /**
       * 检测画面在指定时间片内，是否发生改变
       * @param {number} tickCount 时间片个数
       * @param {Uint32Array} prevFrame 帧数据
       */
      function checkFrame(tickCount, prevFrame) {
        return new Promise(resolve => {
          prevFrame = prevFrame || getFrame(videoElem);
          requestAnimationFrame(() => {
            if (tickCount > 1) return resolve(checkFrame(tickCount-1, prevFrame));
            let currentFrame = getFrame(videoElem);
            let playing = prevFrame.some(
              (frame, i) => frame !== currentFrame[i]
            );
            resolve(playing);
          });
        });
      }

      return checkFrame(tickCount);
    }
