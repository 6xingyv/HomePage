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

