/** @type {import('next').NextConfig} */
const nextConfig = {
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
