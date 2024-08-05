const BASE_URL = window.location.origin;
$.fn.fileinput.defaults.language = 'zh';
let $smfile = $("#file");
$smfile.fileinput({
    // theme: 'fas',
    uploadUrl: BASE_URL + '/mt',
    allowedFileExtensions: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'],
    // allowedFileExtensions: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'mp4', 'mov', 'avi'],
    overwriteInitial: false,
    previewFileType: "image",
    // maxFileSize: '512000',
    maxFileCount: '100',
    maxAjaxThreads: 2,
    showClose: false,
    autoOrientImage: true,
    fileActionSettings: {
        showRemove: true,
        showUpload: true,
        showZoom: true,
        showDrag: true,
    },
    browseClass: "btn btn-success",
    // msgPlaceholder: "选择文件",
    browseLabel: "选择要上传的图片",
    browseIcon: "<i class=\"fas fa-images\"></i> ",
    removeClass: "btn btn-danger",
    // removeLabel: "清除",
    uploadClass: "btn btn-info",
    // uploadLabel: "上传",
    dropZoneTitle: "拖拽文件到这里<br>或将屏幕截图复制并粘贴到此处<br>支持多文件同时上传…",
    // showPreview: false
    // showPreview: false,
})

function hasHtmlTags(string) {
    var pattern = /<(.*)>/;
    return pattern.test(string);
}

$smfile.on('fileselect', function (event, numFiles, label) {
    var files = $('#file').fileinput('getFileStack');
    // console.log(files);
    $.each(files, function (index, blob) {
        if (hasHtmlTags(blob.name)) {
            let filename = DOMPurify.sanitize(blob.name);
            filename = filename.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const myNewFile = new File([blob], filename, { type: blob.type });
            $smfile.fileinput('updateStack', index, myNewFile);
        }
    });
});





var clip = function (el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
};


document.addEventListener('paste', function (event) {
    var isChrome = false;
    if (event.clipboardData || event.originalEvent) {
        var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
        if (clipboardData.items) {
            // for chrome
            var items = clipboardData.items,
                len = items.length,
                blob = null;
            isChrome = true;

            event.preventDefault();

            let images = [];
            for (var i = 0; i < len; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    blob = items[i].getAsFile();
                    images.push(blob);
                }
            }
            if (images.length > 0) {
                uploadBlobFile(images);
            }
            if (blob !== null) {
                let reader = new FileReader();
                reader.onload = function (event) {
                    let base64_str = event.target.result;
                }

            }
        } else {
            //for firefox
        }
    } else {
    }
});


function uploadBlobFile(images) {
    let form = $("#file");
    swal({
        title: "提醒",
        text: "是否添加粘贴的图片?",
        icon: "warning",
        dangerMode: true,
        animation: "pop",
        buttons: {
            cancel: {
                text: "取消",
                visible: true,
                closeModal: true,
            },
            confirm: {
                text: "确定",
                value: true,
                visible: true,
                closeModal: true
            }
        }
    }).then(function (willUpload) {
        if (willUpload) {
            let filesToUpload = [];
            let filePromises = [];

            $.each(images, function (index, blob) {
                let promise = new Promise(function (resolve, reject) {
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        let base64_str = event.target.result;
                        let filename = DOMPurify.sanitize(blob.name);
                        filename = filename.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        let newFile = new File([blob], filename, { type: blob.type });
                        filesToUpload.push(newFile);
                        resolve();
                    };
                    reader.onerror = function (error) {
                        reject(error);
                    };
                    reader.readAsDataURL(blob);
                });
                filePromises.push(promise);
            });

            Promise.all(filePromises).then(function () {
                $(form).fileinput('disablePreview');
                $(form).fileinput('readFiles', filesToUpload);
                $(form).fileinput('upload');
            }).catch(function (error) {
                console.error(error);
            });
        }
    });
}


function DrawImage(ImgD, FitWidth, FitHeight) {
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width <= 260 && image.height <= 260) {
            return;
        }
        if (image.width / image.height >= FitWidth / FitHeight) {
            if (image.width > FitWidth) {
                ImgD.width = FitWidth;
                ImgD.height = (image.height * FitWidth) / image.width;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        } else {
            if (image.height > FitHeight) {
                ImgD.height = FitHeight;
                ImgD.width = (image.width * FitHeight) / image.height;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
    }
}

function formatHtml(data) {
    tpl = $('#image-template').html();
    template = Handlebars.compile(tpl);
    return template(data);
}

var uploaded_files = [];

function render_uploaded() {
    $('#imagedetail').html("");
    $('#htmlcode').html("");
    $('#bbcode').html("");
    $('#markdown').html("");
    $("#showurl").hide();
    if (uploaded_files.length == 0)
        return;
    uploaded_files.sort(function (a, b) { return a.index - b.index; });
    if ($('#showurl').html()) {
        $("#showurl").show();
    }
    uploaded_files.forEach(function (x) {

        var resp = x.resp;
        // console.log(resp);
        var name = resp.data.response.data.filename
        console.log(name);
        // const _URL = "https://community.codewave.163.com/upload/app/"
        // const WPRAW = "https://images.weserv.nl/?url=https://telegra.ph"
        // const PhRAW = "https://telegra.ph"
        var url =  resp.data.response.data.uploadPath
        $('#imagedetail').append(formatHtml({ url: url, code: url}));
        $('#htmlcode').append(formatHtml({ url: url, code: '<img src="' + url + '" />'}));
        $('#bbcode').append(formatHtml({ url: url, code: '[img]' + url + '[/img]' }));
        $('#markdown').append(formatHtml({ url: url, code: '![' + name + '](' + url + ')',}));
    });
}


$smfile.on('fileuploaded', async function (event, data, previewId, index) {
    var form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader;
    if (response.success) {
        response = { data }
        // console.log(response);
        uploaded_files.push({ index: index, resp: response });
        render_uploaded();
    }
});


$smfile.on('fileclear', function (event) {
    $smfile.fileinput("enablePreview");
});
$smfile.on('filecleared', function (event) {
    if ($("#showurl").is(":visible")) {
        uploaded_files = [];
        render_uploaded();
    }
});


$.prototype.fileinput.Constructor.prototype["setUploadUrl"] = function (url) {
    this.uploadUrl = url;
};

$.prototype.fileinput.Constructor.prototype["getUploadUrl"] = function () {
    return this.uploadUrl;
};

$.prototype.fileinput.Constructor.prototype["disablePreview"] = function () {
    this.showPreview = false;
};

$.prototype.fileinput.Constructor.prototype["enablePreview"] = function () {
    this.showPreview = true;
};

$.prototype.fileinput.Constructor.prototype["setFinalUrl"] = function (func) {
    this.finalUrl = func;
};

$.prototype.fileinput.Constructor.prototype["setBeforeAjaxEnqueue"] = function (func) {
    this.beforeAjaxEnqueue = func;
};

var upload_baseurl = `${$smfile.fileinput("getUploadUrl")}?ts=${Date.now()}&rand=${Math.random()}`;

$smfile.on('filelock', function (event, filestack, extraData) {
    $smfile.fileinput("setUploadUrl", `${upload_baseurl}&batch_size=${Object.keys(filestack).length}`);
});


var backend_idx = parseInt(Math.random() * 1000000007) % 20;
$smfile.fileinput("setFinalUrl", function (url, fileId) {
    backend_idx = (backend_idx + 1) % 20;
    return url.replace("XXXXXX", `${backend_idx}`);
});

$smfile.fileinput("setBeforeAjaxEnqueue", function (settings) {
    delete settings['fileId'];
    var file = settings.data.get("file");
    // var pdata = file.arrayBuffer();
    var blob = file.slice();
    var uri = decodeURI(settings.url);
    var filename = file.name;
    uri = uri + "&filename=" + filename;
    /* return pdata.then((data)=>{
      settings.url = encodeURI(uri);
      settings.data = data;
      return Promise.resolve(settings);
    }, ()=>{
      return Promise.resolve(settings);
    });*/
    settings.url = encodeURI(uri);
    settings.data = blob;
    return settings;
});

let div_caption = $(".kv-fileinput-caption");
div_caption.attr('onclick', 'clickFile()');
function clickFile() {
    $smfile.click();
}

$smfile.on('filebatchuploadcomplete', function (event, files, extra) {
    $('img.lazy').lazyload();
});


function showImage(element) {
    var imageUrl = element.getAttribute("src");
    var lightboxOverlay = document.getElementById("lightbox-overlay");
    var lightboxImage = document.getElementById("lightbox-image");

    lightboxImage.src = imageUrl;
    lightboxOverlay.style.display = "block";
}

document.getElementById("lightbox-overlay").addEventListener("click", function () {
    this.style.display = "none";
});


// 发起 AJAX 请求
$.ajax({
    url: '/total',
    method: 'GET',
    success: function (data) {
        // console.log(data);
        // 将返回的数据渲染到指定的 <span> 元素中
        $('#total').text(data.total);
    },
    error: function () {
        $('#total').text("?");
        console.error('请求失败');
    }
});

// 发起 AJAX 请求
$.ajax({
    url: '/ip',
    method: 'GET',
    success: function (data) {
        // console.log(data);
        // 将返回的数据渲染到指定的 <span> 元素中
        $('#ipinfo').text(data.ip);
    },
    error: function () {
        $('#ipinfo').text("?");
        console.error('请求失败');
    }
});

var currentTab = 'imagedetail';

function updateTab(tab) {
    currentTab = tab;

}


// 初始化 Clipboard.js
var clipboard = new ClipboardJS('#copyAllButton', {
    text: function () {
        var cpurls = Array.from(document.querySelectorAll(`#${currentTab} .cpurl`)).map(function (input) {
            return input.value;
        });

        return cpurls.join('\n');
    }
});

// 复制成功后的提示
clipboard.on('success', function (e) {
    swal('复制成功', '', 'success');
});

// 复制失败后的提示
clipboard.on('error', function (e) {
    console.log(e);
    swal('复制失败', '', 'error');
});