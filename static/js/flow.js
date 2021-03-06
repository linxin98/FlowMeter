// 是否开始监听标记
var start = false;
// 实时下载、上传速度
var downloadNow = 0;
var uploadNow = 0;


$(document).ready(function () {
    // 页面铺满屏幕
    var screenHeight = document.documentElement.clientHeight;
    var contentHeight = screenHeight - 60 - 60 - 20;
    document.getElementById("content").style.height = contentHeight + "px";

    // 生成分析结果展示表格
    generateTable("address-analysis", 5, 3);
    generateTable("name-analysis", 5, 3);
    generateTable("burst-analysis", 3, 5)
});


/*
* 创建表格主体部分
*/
function generateTable(tableID, num_rows, num_columns) {
    var table = document.getElementById(tableID);
    var tbody = document.createElement('tbody');

    for (var i = 0; i < num_rows; i++) {
        var row = document.createElement('tr');

        var column = document.createElement('th')
        column.setAttribute("style", "vertical-align: middle;");
        column.innerText = i + 1;
        row.appendChild(column)

        for (var j = 0; j < num_columns - 1; j++) {
            var column = document.createElement('td');
            column.setAttribute("style", "vertical-align: middle;");
            row.appendChild(column);
        }

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
}


/*
* 选择设备
*/
function selectDevice() {
    if ($("#device-index").val() == -1) {
        alert("请选择网络设备")
        return
    }
    $.ajax({
        url: "select/",
        type: "GET",
        data: {
            "device_index": $("#device-index").val()
        },
        success: function (data) {
            start = true;
        },
        error: function () {
            alert('Error: selectDevice')
        }
    })
}


/*
* 获取流量数据
*/
function getFlowData() {
    $.ajax({
        url: "get_flow/",
        type: "GET",
        data: {
        },
        success: function (data) {
            var results = JSON.parse(data);

            $("#history-download").text(results["download_history"]);
            $("#history-upload").text(results["upload_history"]);

            downloadNow = results["download_now"];
            uploadNow = results["upload_now"];
        },
        error: function () {
            alert('Error: getFlowData')
        }
    })
}


/*
* 地点分析
*/
function analyzeAddresses() {
    $.ajax({
        url: "address/",
        type: "GET",
        data: {
        },
        success: function (data) {
            var results = JSON.parse(data);
            var topDownloadAddresses = sortDict(results["download"]);
            var topUploadAddresses = sortDict(results["upload"]);

            changeTableValues("address-analysis", topDownloadAddresses, topUploadAddresses);
        },
        error: function () {
            alert('Error: analyzeAddresses')
        }
    })
}


/*
* 端口分析
*/
function analyzeNames() {
    $.ajax({
        url: "name/",
        type: "GET",
        data: {
        },
        success: function (data) {
            var results = JSON.parse(data);
            var topDownloadNames = sortDict(results["download"]);
            var topUploadNames = sortDict(results["upload"]);

            changeTableValues("name-analysis", topDownloadNames, topUploadNames);
        },
        error: function () {
            alert('Error: analyzeNames')
        }
    })
}


/*
* 突发流量分析
*/
function analyzeBurst() {
    $.ajax({
        url: "burst/",
        type: "GET",
        data: {
        },
        success: function (data) {
            var results = JSON.parse(data);
            var burst = results["burst"];

            var table = document.getElementById("burst-analysis");

            for (var i = 0; i < 3; i++) {
                values = burst[String(i)];

                if (typeof values != "undefined") {
                    table.rows[i + 1].cells[1].innerText = values[0];
                    table.rows[i + 1].cells[2].innerText = values[1];
                    if (values[7] == "True") {
                        table.rows[i + 1].cells[3].innerText = "下载";
                    }
                    else {
                        table.rows[i + 1].cells[3].innerText = "上传";
                    }
                    table.rows[i + 1].cells[4].innerText = values[2];
                }
                else {
                    for (var j = 1; j < 5; j++) {
                        table.rows[i + 1].cells[j].innerText = "";
                    }
                }
            }
        },
        error: function () {
            alert('Error: analyzeBurst')
        }
    })
}


/*
* 根据字典的值对键进行排序
*/
function sortDict(dict) {
    var sortedKeys = [];

    var top = 5;

    var keys = Object.keys(dict);
    if (top > keys.length) {
        top = keys.length;
    }

    for (var i = 0; i < top; i++) {
        var maxKey;
        var max = 0;

        for (var key in dict) {
            if (dict[key] > max) {
                maxKey = key;
                max = dict[key];
            }
        }

        sortedKeys.push(maxKey);
        delete dict[maxKey];
    }

    for (var i = 0; i < 5 - top; i++) {
        sortedKeys.push("")
    }

    return sortedKeys;
}


/*
* 改变表格单元格内容
*/
function changeTableValues(tableID, downloadList, uploadList) {
    var table = document.getElementById(tableID);
    for (var i = 1; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[0].cells.length; j++) {
            table.rows[i].cells[1].innerText = downloadList[i - 1];
            table.rows[i].cells[2].innerText = uploadList[i - 1];
        }
    }
}


/*
* 绘制实时流量数据折线图
*/
function plotRealTimeTrafficChart() {
    var base = +new Date();
    var interval = 2 * 1000;

    var time = [];
    var download = [];
    var upload = [];

    var now = new Date(base);

    // 添加折线图数据
    function addData(shift) {
        // 计算此刻时间
        now = new Date();
        now = [now.getHours(), now.getMinutes(), now.getSeconds()];
        for (var i = 0; i < 3; i++) {
            if (now[i] < 10) {
                now[i] = "0" + now[i];
            }
        }
        now = now.join(":")

        // 从后端更新流量数据
        getFlowData();
        // 从后端更新地址分析结果
        analyzeAddresses();
        // 从后端更新域名分析结果
        analyzeNames();
        // 从后端更新突发流量分析结果
        analyzeBurst();

        // 列表加入新数据
        time.push(now);
        download.push(downloadNow)
        upload.push(uploadNow)

        // 列表平移
        if (shift) {
            time.shift();
            download.shift();
            upload.shift();
        }
    }

    // Echarts设置
    lineOption = {
        title: {
            text: "实时流量"
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
        },
        yAxis: {
            boundaryGap: [0, '50%'],
            type: 'value'
        },
        legend: {

        },
        series: [
            {
                name: '下载',
                type: 'line',
                smooth: true,
                symbol: 'none',
                data: download
            },
            {
                name: '上传',
                type: 'line',
                smooth: true,
                symbol: 'none',
                data: upload
            }
        ]
    };

    var downloadDashboardOption;
    downloadDashboardOption = {
        title: {
            text: "实时下载速度",
            left: 'center'
        },
        series: [{
            type: 'gauge',
            axisLine: {
                lineStyle: {
                    width: 10,
                    color: [
                        [0.3, '#67e0e3'],
                        [0.7, '#37a2da'],
                        [1, '#fd666d']
                    ]
                }
            },
            pointer: {
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                distance: -30,
                length: 8,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
            splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                    color: '#fff',
                    width: 4
                }
            },
            axisLabel: {
                color: 'auto',
                distance: -15,
                fontSize: 10
            },
            detail: {
                valueAnimation: true,
                formatter: '{value} B/s',
                color: 'auto',
                fontSize: 15
            },
            data: [{
                value: 0
            }]
        }]
    };

    var uploadDashboardOption;
    uploadDashboardOption = {
        title: {
            text: "实时上传速度",
            left: 'center'
        },
        series: [{
            type: 'gauge',
            axisLine: {
                lineStyle: {
                    width: 10,
                    color: [
                        [0.3, '#67e0e3'],
                        [0.7, '#37a2da'],
                        [1, '#fd666d']
                    ]
                }
            },
            pointer: {
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                distance: -30,
                length: 8,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
            splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                    color: '#fff',
                    width: 4
                }
            },
            axisLabel: {
                color: 'auto',
                distance: -15,
                fontSize: 10
            },
            detail: {
                valueAnimation: true,
                formatter: '{value} B/s',
                color: 'auto',
                fontSize: 15
            },
            data: [{
                value: 0
            }]
        }]
    };

    // 设置更新时间间隔
    setInterval(function () {
        if (start) {
            addData(time.length > 100);
        }

        trafficChart.setOption({
            xAxis: {
                data: time
            },
            series: [
                {
                    name: '下载',
                    data: download
                }, {
                    name: '上传',
                    data: upload
                }
            ]
        });

        downloadDashboardOption.series[0].data[0].value = downloadNow;
        downloadDashboard.setOption(downloadDashboardOption, true);

        uploadDashboardOption.series[0].data[0].value = uploadNow;
        uploadDashboard.setOption(uploadDashboardOption, true);
    }, interval);

    // 基于准备好的DOM，初始化Echarts实例
    var trafficChart = echarts.init(document.getElementById("traffic-chart"));
    trafficChart.setOption(lineOption);
    var downloadDashboard = echarts.init(document.getElementById("real-time-download-dashboard"));
    downloadDashboard.setOption(downloadDashboardOption);
    var uploadDashboard = echarts.init(document.getElementById("real-time-upload-dashboard"));
    uploadDashboard.setOption(uploadDashboardOption);
}