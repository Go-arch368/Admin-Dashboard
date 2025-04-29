import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.pravatar.cc"],
  },
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
    ignoreDuringBuilds: true,
  },
  headers: async () => [
    {
      source: "/dashboard",
      headers: [
        {
          key: "Cache-Control",
          value: "private",
        },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "index, follow",
        },
      ],
    },
  ],
  experimental: {
    optimizePackageImports: [
      "@nextui-org/react",
      "react-apexcharts",
      "@heroui/react",
    ],
  },
  webpack: (config: Configuration, { isServer }) => {
    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|next|@nextui-org|@heroui|react-apexcharts)[\\/]/,
            name: "vendor",
            chunks: "all",
            priority: 20,
          },
          modern: {
            test: /[\\/]node_modules[\\/]/,
            name: "modern",
            chunks: "all",
            priority: 10,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;