//主页Title功能
var title = document.title
var icon_iceberg = "./image/iceberg.webp";
var icon_heart = "./image/heart.png";
var link = document.querySelector('link[rel*="icon"]');
document.addEventListener("visibilitychange", function () {
    var string = document.visibilityState
    if (string === 'hidden') {
        document.title = '我藏起来了ヾ(≧▽≦*)o';
        link.href = icon_iceberg;
    };
    if (string === 'visible') {
        document.title = title;
        link.href = icon_heart;
    }
});


function settings() {
    var data = [{
        "title": "搜索引擎",
        "type": "select",
        "value": "engines",
        "data": [{
            "t": "跟随Via浏览器",
            "v": "via"
        }, {
            "t": "夸克搜索",
            "v": "quark"
        }, {
            "t": "百度搜索",
            "v": "baidu"
        }, {
            "t": "谷歌搜索",
            "v": "google"
        }, {
            "t": "必应搜索",
            "v": "bing"
        }, {
            "t": "神马搜索",
            "v": "sm"
        }, {
            "t": "好搜搜索",
            "v": "haosou"
        }, {
            "t": "搜狗搜索",
            "v": "sogou"
        }, {
            "t": "自定义",
            "v": "diy"
        }]
    }, {
        "title": "设置LOGO",
        "value": "logo"
    }, {
        "title": "恢复默认LOGO",
        "value": "delLogo"
    }, {
        "title": "图标颜色",
        "type": "select",
        "value": "bookcolor",
        "data": [{
            "t": "深色图标",
            "v": "black"
        }, {
            "t": "浅色图标",
            "v": "white"
        }]
    }, {
        "title": "主页样式细圆",
        "type": "checkbox",
        "value": "styleThin"
    }, {
        "title": "夜间模式",
        "type": "checkbox",
        "value": "nightMode"
    }, {
        "title": "记录搜索历史",
        "type": "checkbox",
        "value": "searchHistory"
    }, {
        "type": "hr"
    }, {
        "title": "导出主页数据",
        "value": "export"
    }, {
        "title": "导入主页数据",
        "value": "import"
    }, {
        "type": "hr"
    }, {
        "title": "Github",
        "value": "openurl",
        "description": "https://github.com/6xingyv/HomePage"
    }, {
        "title": "关于",
        "description": "当前版本：" + app.version + "<br>这是一个简单的主页，目前兼容via浏览器，其他浏览器也可以试试。<br>目前壁纸来源是Bing美图~每天精选全球摄影就不用担心壁纸选择困难症了！"
    }, {
        "title": "鸣谢",
        "description": "刘明野/quarkHomePage"
    }];
    var html = '<div class="page-settings"><div class="set-header"><div class="set-back"></div><p class="set-logo">主页设置</p></div><ul class="set-option-from">';
    for (var json of data) {
        if (json.type === 'hr') {
            html += `<li class="set-hr"></li>`;
        } else {
            html += `<li class="set-option" ${json.value ? `data-value="${json.value}"` : ''}>
                        <div class="set-text">
                            <p class="set-title">${json.title}</p>
                            ${json.description ? `<div class="set-description">${json.description}</div>` : ''}
                        </div>`;
            if (json.type === 'select') {
                html += `<select class="set-select">`;
                for (var i of json.data) {
                    html += `<option value="${i.v}">${i.t}</option>`;
                }
                html += `</select>`;
            } else if (json.type === 'checkbox') {
                html += `<input type="checkbox" class="set-checkbox" autocomplete="off"><label></label>`;
            }
            html += `</li>`;
        }
    }
    html += '</ul></div>';
    $('#app').append(html);

    $(".page-settings").show();
    $(".page-settings").addClass('animation');

    var browser = browserInfo();
    if (browser !== 'via') { // 只有VIA浏览器才能显示
        $('option[value=via]').hide();
    }

    $(".set-option .set-select").map(function () {
        $(this).val(settings.get($(this).parent().data('value')));
    });

    $(".set-option .set-checkbox").map(function () {
        $(this).prop("checked", settings.get($(this).parent().data('value')));
    });

    $(".set-back").click(function () {
        $(".page-settings").css("pointer-events", "none").removeClass("animation");
        $(".page-settings").on('transitionend', function (evt) {
            if (evt.target !== this) {
                return;
            }
            $(".page-settings").remove();
        });
    });

    $(".set-option").click(function (evt) {
        var $this = $(this);
        var value = $this.data("value");
        if (value === "wallpaper") {
            openFile(function () {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                    settings.set('wallpaper', this.result);
                };
                reader.readAsDataURL(file);
            });
        } else if (value === "logo") {
            openFile(function () {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                    settings.set('logo', this.result);
                };
                reader.readAsDataURL(file);
            });
        } else if (value === "delLogo") {
            settings.set('wallpaper', '');
            settings.set('logo', '');
            settings.set('bookcolor', 'black');
            location.reload();
        } else if (value === "openurl") {
            open($this.find('.set-description').text());
        } else if (value === "export") {
            var oInput = $('<input>');
            oInput.val('{"bookMark":' + JSON.stringify(bookMark.getJson()) + '}');
            //oInput.val('{"bookMark":' + JSON.stringify(bookMark.getJson()) + ',"setData":' + JSON.stringify(settings.getJson()) + '}');
            document.body.appendChild(oInput[0]);
            console.log(store.get('bookMark'));
            oInput.select();
            document.execCommand("Copy");
            alert('已复制到剪贴板，请粘贴保存文件。');
            oInput.remove();
        } else if (value === "import") {
            var data = prompt("在这粘贴主页数据");
            try {
                data = JSON.parse(data);
                store.set("bookMark", data.bookMark);
                store.set("setData", data.setData);
                alert("导入成功!");
                location.reload();
            } catch (e) {
                alert("导入失败!");
            }
        } else if (evt.target.className !== 'set-select' && $this.find('.set-select').length > 0) {
            $.fn.openSelect = function () {
                return this.each(function (idx, domEl) {
                    if (document.createEvent) {
                        var event = document.createEvent("MouseEvents");
                        event.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        domEl.dispatchEvent(event);
                    } else if (element.fireEvent) {
                        domEl.fireEvent("onmousedown");
                    }
                });
            }
            $this.find('.set-select').openSelect();
        } else if (evt.target.className !== 'set-checkbox' && $this.find('.set-checkbox').length > 0) {
            $this.find('.set-checkbox').prop("checked", !$this.find('.set-checkbox').prop("checked")).change();
        }
    });

    $(".set-select").change(function () {
        var dom = $(this),
            item = dom.parent().data("value"),
            value = dom.val();
        if (item === "engines" && value === "diy") {
            var engines = prompt("输入搜索引擎网址，（用“%s”代替搜索字词）");
            console.log(engines);
            if (engines) {
                settings.set('diyEngines', engines);
            } else {
                dom.val(settings.get('engines'));
                return false;
            }
        }
        // 保存设置
        settings.set(item, value);
    });

    $(".set-checkbox").change(function () {
        var dom = $(this),
            item = dom.parent().data("value"),
            value = dom.prop("checked");
        // 应用设置
        if (item === 'styleThin' && value === true) {
            $("body").addClass('styleThin');
        } else {
            $("body").removeClass('styleThin');
        }
        // 保存设置
        settings.set(item, value);
    });

};