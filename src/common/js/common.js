/**
 * 将返回的数组数据进行修改，用于显示表的数据
 * 计算百分比后添加到对象的percent字段中
 * value字段的值添加单位
 * 参数arrName 为原数组的名字
 * 参数unit 为表格显示的单位
 */
export function arrModify(arrName,unit) {
  var total = 0;
  //科室业绩数组重构，用于显示表数据。添加百分比字段，value字段添加“万”单位。
  var newArr = [].concat(JSON.parse(JSON.stringify(arrName)));
  for (var i = 0; i < arrName.length; i++) {
    total += parseFloat(arrName[i].value);
  }
  for (var i = 0; i < arrName.length; i++) {
    var percent = arrName[i].value / total * 100;
    percent = percent.toFixed(2);
    newArr[i].percent = percent + "%";
    newArr[i].value = arrName[i].value + unit;
  }
  return newArr;
}

/**
 * 根据选择的时间范围，让曲线图的tooltip显示不同的内容
 * timeType为传入的时间类型
 * curveOption为图表配置对象
 */
export function toolTip(timeType,curveOption,initLastList) {
  var formatterFn;
  if (timeType == 3) {
    curveOption.series[1].data = [];
    curveOption.tooltip.formatter = "{b0}: {c0}万";
    curveOption.series[0].name = '年';
    curveOption.legend.data = ['年'];
  } else if (timeType == 2) {
    formatterFn = function (params) {
      var res = '';
      var nyr = params[0].axisValue;
      var n = nyr.substr(0, 4);
      var y = nyr.substr(5, 2);
      var r = nyr.substr(8, 2);
      var n2 = n - 1 + "";
      if (!params[1] && params[0].seriesName === "去年") {
        res = n2 + "-" + y + ": " + params[0].data + "万" + "</br>";
      } else if (!params[1] && params[0].seriesName === "今年") {
        res = params[0].axisValue + ": " + params[0].data + "万" + "</br>";
      } else {
        res += params[0].axisValue + ": " + params[0].data + "万" + "</br>";
        res += n2 + "-" + y + ": " + params[1].data + "万" + "</br>";
      }
      return res;
    }
    curveOption.series[0].name = '今年';
    curveOption.legend.data = ['今年', '去年'];
    curveOption.tooltip.formatter = formatterFn;
  } else if (timeType !== 3 && !initLastList) {
    curveOption.tooltip.formatter = "{b0}: {c0}万";
  } else {
    formatterFn = function (params) {
      var res = '';
      var nyr = params[0].axisValue;
      var n = nyr.substr(0, 4);
      var y = nyr.substr(5, 2);
      var r = nyr.substr(8, 2);
      var n2 = n - 1 + "";
      if (!params[1] && params[0].seriesName === "去年") {
        res = n2 + "-" + y + "-" + r + ": " + params[0].data + "万" + "</br>";
      } else if (!params[1] && params[0].seriesName === "今年") {
        res = params[0].axisValue + ": " + params[0].data + "万" + "</br>";
      } else {
        res += params[0].axisValue + ": " + params[0].data + "万" + "</br>";
        res += n2 + "-" + y + "-" + r + ": " + params[1].data + "万" + "</br>";
      }
      return res;
    }
    curveOption.series[0].name = '今年';
    curveOption.legend.data = ['今年', '去年'];
    curveOption.tooltip.formatter = formatterFn;
  }
}
