import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/logo.png",
        search: "",
      },
      {
        pathname: "/logo.png",
        search: "?v=2",
      },
      {
        pathname: "/logo.png",
        search: "?v=ascv1",
      },
    ],
  },
};

export default nextConfig;
