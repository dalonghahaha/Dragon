var content_type = module.exports = {
    'json': 'application/json',
    'xml': 'text/xml',
    'css': 'text/css',
    'js': 'application/x-javascript',
    'html': 'text/html',
    'htm': 'text/html',
    'ico': 'image/x-icon',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpe': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    //是否静态资源
    is_static: function(extend) {
        const static_extend = new Set(['json', 'xml', 'css', 'js', 'html', 'htm', 'ico', 'png', 'jpg', 'jpe', 'jpeg', 'gif', 'tif', 'tiff']);
        return static_extend.has(extend);
    },
    //是否图片资源
    is_imgdata: function(extend) {
        const static_extend = new Set(['ico', 'png', 'jpg', 'jpe', 'jpeg', 'gif', 'tif', 'tiff']);
        return static_extend.has(extend);
    }
};
