/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, process: false, buffer: false };

        return config;
    },
    reactStrictMode: true,
    rewrites: async () => {
        return [
            {
                source: '/static/:customPage',
                destination: '/static/:customPage/index.html',
            },
        ];
    },
};

module.exports = nextConfig;
