import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link,
    Button,
  } from "@nextui-org/react";
  import { useState } from "react";
  
  const CustomNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
      <NextUINavbar
        onMenuOpenChange={setIsMenuOpen}
        className="text-white bg-[#111111] w-[80%] mt-10"
      >
        <NavbarContent>
          <NavbarBrand>
            <p className="font-bold text-inherit">KTU Result Viewer</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link href="#" className="text-white">
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" className="text-white">
              Github
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="pt-16 text-center">
          <NavbarMenuItem>
            <Link href="#" className="text-black">
              About
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="#" className="text-black">
              Github
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </NextUINavbar>
    );
  };
  
  export default CustomNavbar;
  