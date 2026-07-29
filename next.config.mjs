/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/copy-of-terms-of-use",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms-of-use",
        destination: "/terms-and-conditions",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/public/:path*", destination: "/:path*" },
      ],
    };
  },
};

export default nextConfig;
