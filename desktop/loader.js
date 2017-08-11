// See https://stackoverflow.com/a/3855394/130121
var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var bannerName = qs.banner || 'banner_ctrl';

$( 'body' ).append( '<script src="/' + bannerName + '.js"></script>' );
window.document.title = bannerName + ' | ' + window.document.title;

// TODO: display navigational elements for easily switching between banners
