/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/public/:path*", destination: "/:path*" },
      ],
    };
  },
};

export default nextConfig;
