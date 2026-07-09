/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/legacy/index.html" },
        { source: "/courses", destination: "/legacy/courses/index.html" },
        { source: "/courses/:path*", destination: "/legacy/courses/:path*/index.html" },
        { source: "/cursos/:path*", destination: "/legacy/cursos/:path*/index.html" },
        { source: "/placement-test", destination: "/legacy/index.html" },
        { source: "/public/:path*", destination: "/:path*" },
      ],
    };
  },
};

export default nextConfig;
