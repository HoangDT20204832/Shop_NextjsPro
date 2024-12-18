import React from "react";
import { Box, Typography, Link, Stack, Divider,useTheme } from "@mui/material";
import { Icon } from "@iconify/react";

const FooterComp: React.FC = () => {
  const theme = useTheme()

  return (
    <Box sx={{ backgroundColor: theme.palette.background.paper, pt: 6, pb: 4 }}>
      {/* Phần top */}
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", px: 2 }}>
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" spacing={4}>
          {/* Chăm sóc khách hàng */}
          <Box>
            <Typography
              sx={{ fontSize: "1.4rem", textTransform: "uppercase", fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}
            >
              Chăm sóc khách hàng
            </Typography>
            <Stack spacing={1}>
              <Link href="#" sx={linkStyle}>Trung tâm trợ giúp</Link>
              <Link href="#" sx={linkStyle}>Blog</Link>
              <Link href="#" sx={linkStyle}>Mail</Link>
              <Link href="#" sx={linkStyle}>Hướng dẫn mua hàng</Link>
              <Link href="#" sx={linkStyle}>Hướng dẫn bán hàng</Link>
            </Stack>
          </Box>

          {/* Về trang web */}
          <Box>
            <Typography
              sx={{ fontSize: "1.4rem", textTransform: "uppercase", fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}
            >
              Về trang web
            </Typography>
            <Stack spacing={1}>
              <Link color='text.secondary' href="#" sx={linkStyle}>Giới thiệu về Ứng dụng</Link>
              <Link href="#" sx={linkStyle}>Tuyển dụng</Link>
              <Link href="#" sx={linkStyle}>Điều khoản trang web</Link>
              <Link href="#" sx={linkStyle}>Chính sách bảo mật</Link>
              <Link href="#" sx={linkStyle}>Chính hãng</Link>
            </Stack>
          </Box>

          {/* Theo dõi */}
          <Box>
            <Typography
              sx={{ fontSize: "1.4rem", textTransform: "uppercase", fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}
            >
              Theo dõi chúng tôi trên
            </Typography>
            <Stack spacing={1}>
              <Link href="#" sx={linkStyle}>
                <Icon icon="akar-icons:facebook-fill" style={{ marginRight: "8px" }} />
                Facebook
              </Link>
              <Link href="#" sx={linkStyle}>
                <Icon icon="akar-icons:instagram-fill" style={{ marginRight: "8px" }} />
                Instagram
              </Link>
              <Link href="#" sx={linkStyle}>
                <Icon icon="akar-icons:linkedin-fill" style={{ marginRight: "8px" }} />
                LinkedIn
              </Link>
            </Stack>
          </Box>

          {/* Tải ứng dụng */}
          <Box>
            <Typography
              sx={{ fontSize: "1.4rem", textTransform: "uppercase", fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}
            >
              Tải ứng dụng ngay
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box component="img" src="https://down-vn.img.susercontent.com/file/a5e589e8e118e937dc660f224b9a1472" alt="QR Code" sx={{ width: "88px", height: "88px", border: "1px solid #ddd" }} />
              <Stack spacing={1}>
                <Box component="img" src="https://down-vn.img.susercontent.com/file/ad01628e90ddf248076685f73497c163" alt="App Store" sx={downloadAppStyle} />
                <Box component="img" src="https://down-vn.img.susercontent.com/file/ae7dced05f7243d0f3171f786e123def" alt="Google Play" sx={downloadAppStyle} />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Phần divider */}
      <Divider sx={{ my: 4, backgroundColor: "#ddd" }} />

      {/* Phần bottom */}
      <Box sx={{ textAlign: "center", backgroundColor: theme.palette.background.paper, py: 3 }}>
        <Typography  color='text.secondary' sx={{ fontSize: "1.2rem", mb: 1 }}>
          © 2023. Tất cả các quyền được bảo lưu.
        </Typography>
        <Typography color='text.secondary' sx={{ fontSize: "1.2rem" }}>
          Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội.
        </Typography>
      </Box>
    </Box>
  );
};

// Các style được tái sử dụng
const linkStyle = {
  color: "#666",
  fontSize: "1.3rem",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  "&:hover": { color: "#0A68FF" }
};

const downloadAppStyle = {
  height: "22px",
  cursor: "pointer"
};

export default FooterComp;
