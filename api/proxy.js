const { createProxyMiddleware } = require('http-proxy-middleware')

export default (req, res) => {
    let target = ''
    if (req.url.startsWith('/kodepay')) {
        target = 'https://kodepay-global.zingfront.com'
    }
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/kodepay/': '/'
        }
    })(req, res)
}

// https://segmentfault.com/a/1190000042276351