/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 's3.timeweb.cloud',
              pathname: '/**', // Разрешение на все пути на этом хосте
            },
            {
                protocol: 'https',
                hostname: 't.me',
                pathname: '/**',
            }
        ],
    }
};

export default nextConfig;
