window.onload = function () {

  var baseImg = "img/data-1571295640429-3Co5rpLX.png"; // 背景纹理贴图

  // var baseImg = "img/map1.png";
  var scanImg = "img/data-1571295559348-whnsd6fi.jpg"; // 扫描光影效果
  // var scanImg = "img/map2.png";

  var config = { // 扫描线条配置
    lineWidth: 0.5, // 扫描线条宽度
    color: '#00FFC2', // 线条颜色
    levels: 1,
    intensity: 2, // 强度
    threshold: 0.01
  }

  var canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 2048;
  context = canvas.getContext("2d");

  context.lineWidth = config.lineWidth;
  context.strokeStyle = config.color;
  context.fillStyle = config.color;
  context.shadowColor = config.color;

  image(scanImg).then(function (image) {
    var m = image.height,
      n = image.width,
      values = new Array(n * m),
      contours = d3.contours().size([n, m]).smooth(true),
      projection = d3.geoIdentity().scale(canvas.width / n),
      path = d3.geoPath(projection, context);

    //   StackBlur.R(image, 5);

    for (var j = 0, k = 0; j < m; ++j)
    {
      for (var i = 0; i < n; ++i, ++k)
      {
        values[k] = image.data[(k << 2)] / 255;
      }
    }

    var opt = {
      image: canvas
    }

    var results = [];

    function update (threshold, levels) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      var thresholds = [];
      for (var i = 0; i < levels; i++)
      {
        thresholds.push((threshold + 1 / levels * i) % 1);
      }
      results = contours.thresholds(thresholds)(values);
      redraw();
    }

    function redraw () {
      results.forEach(function (d, idx) {
        context.beginPath();
        path(d);
        context.globalAlpha = 1;
        context.stroke();
        if (idx > config.levels / 5 * 3)
        {
          context.globalAlpha = 0.01;
          context.fill();
        }
      });
      opt.onupdate();
    }
    d3.timer(function (t) {
      var threshold = (t % 10000) / 10000;
      update(threshold, 1);
    });

    initCharts(opt);

    update(config.threshold, config.levels);

  });

  function image (url) {
    return new Promise(function (resolve) {
      var image = new Image();
      image.src = url;
      image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = image.width / 8;
        canvas.height = image.height / 8;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      };
    });
  }

  function initCharts (opt) {
    var contourChart = echarts.init(document.createElement('canvas'), null, {
      width: 4096,
      height: 2048
    });

    var img = new echarts.graphic.Image({
      style: {
        image: opt.image,
        x: -1,
        y: -1,
        width: opt.image.width + 2,
        height: opt.image.height + 2
      }
    });
    contourChart.getZr().add(img);

    opt.onupdate = function () {
      img.dirty();
    };

    var myChart = echarts.init(document.getElementById('box'));

    myChart.setOption({

      globe: {
        baseTexture: baseImg,// 使用地球的纹理图片
        displacementScale: 0.05,
        displacementQuality: 'high',
        shading: 'realistic',//真实感渲染
        realisticMaterial: {
          roughness: 0.2,
          metalness: 0
        },
        // environment: none,
        postEffect: {
          enable: true,
          depthOfField: {
            // enable: true
          }
        },
        light: {
          ambient: {
            intensity: 1
          },
          main: { // 主光源
            intensity: 0,
            shadow: false
          }
        },
        viewControl: {
          center: [0, 0, 0],
          alpha: 30,
          beta: 160,
          autoRotate: true,
          autoRotateAfterStill: 10,
          distance: 240,
          autoRotateSpeed: 20
        },
        layers: [{
          type: 'blend',
          blendTo: 'emission',
          texture: contourChart,
          intensity: config.intensity
        }]
      },
      series: [{ // 点
        type: 'scatter3D',
        blendMode: 'lighter',
        coordinateSystem: 'globe',
        showEffectOn: 'render',
        zlevel: 2,
        effectType: 'ripple',
        symbolSize: 15,
        rippleEffect: {
          period: 4,
          scale: 4,
          brushType: 'fill'
        },

        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: 'rgba(235, 232, 6, 0.8)'
          }
        },
        data: []
      }]
    });
  }
}