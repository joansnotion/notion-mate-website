const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
    let target = ''

    if (req.url.startsWith('/kodepay')) {
        target = 'https://kodepay-global.zingfront.com/'
    }

    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/kodepay': '/'
        }
    })(req, res)
}

// https://mirror.xyz/cryptoshine.eth/vnUGKBxqr8PygtIu44zEI8E7FVuOOMHrT4e8WR6-2ho