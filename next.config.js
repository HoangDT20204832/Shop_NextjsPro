

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    largePageDataBytes: 128 * 100000
  },
  
  images: {
      // ĐỊnh nghĩa đường dẫn để chấp nhận hình ảnh từ bên thứ 3(Google, Facebook, Twitter)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*platform-lookaside.fbsbx.com",
        port: "",
        pathname: "**",
      },
    ]
  }
}

module.exports = nextConfig

