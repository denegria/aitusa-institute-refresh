/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/legacy/index.html" },
        { source: "/courses", destination: "/legacy/index.html" },
        { source: "/courses/:path*", destination: "/legacy/index.html" },
        { source: "/cursos/:path*", destination: "/legacy/index.html" },
        { source: "/placement-test", destination: "/legacy/index.html" },
        { source: "/public/:path*", destination: "/:path*" },
      ],
    };
  },
};

export default nextConfig;
