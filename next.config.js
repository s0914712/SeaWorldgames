// File: next.config.js

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com'], // 如果你計劃從外部源加載圖像，添加相應的域名
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
