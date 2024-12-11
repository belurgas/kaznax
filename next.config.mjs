/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: [
        {
          key: 'X-Accel-Buffering',
          value: 'no',
       },
    ],
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
