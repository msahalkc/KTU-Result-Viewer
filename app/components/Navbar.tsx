import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link,
  } from "@nextui-org/react";
  import { useState } from "react";
  
  const CustomNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
      <NextUINavbar
        onMenuOpenChange={setIsMenuOpen}
        className="text-white bg-transparent backdrop-saturate-100 mt-10"
      >
        <NavbarContent>
          <NavbarBrand className='flex md:flex-row flex-col items-start'>
            <p className="font-bold">KTU Result Viewer</p><p className="font-normal text-tiny md:text-base">: by Muhammed Sahal K C</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link href="https://msahalkc.netlify.app" className="text-white">
              Portfolio
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="https://github.com/msahalkc/KTU-Result-Viewer" className="text-white">
              Github
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="pt-16 text-center">
          <NavbarMenuItem>
            <Link href="https://msahalkc.netlify.app" className="text-black">
              Portfolio
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="https://github.com/msahalkc/KTU-Result-Viewer" className="text-black">
              Github
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </NextUINavbar>
    );
  };
  
  export default CustomNavbar;
  