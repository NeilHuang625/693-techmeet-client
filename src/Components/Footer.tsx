import { Button, Divider } from "@mui/material";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="flex flex-col jsutify-center items-center bg-gray-800">
      <div className="w-4/5 py-10">
        <div className="grid grid-cols-9 gap-1">
          <div className="col-span-6">
            <Link to="/">
              <img src={logo} className="w-[200px]" />
            </Link>
          </div>
          <div className="col-span-1 text-right">
            <Button sx={{ fontSize: "small", color: "white" }}>About</Button>
          </div>
          <div className="col-span-1 text-right">
            <Button sx={{ fontSize: "small", color: "white" }}>Policies</Button>
          </div>
          <div className="col-span-1 text-right">
            <Button sx={{ fontSize: "small", color: "white" }}>Contact</Button>
          </div>
        </div>

        <Divider sx={{ backgroundColor: "white", marginTop: "40px" }} />
        <Typography
          sx={{ fontSize: "small", color: "white", marginTop: "20px" }}
          className="text-center"
        >
          © 2024 TechMeet by <span className="font-bold">Neil</span>
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
