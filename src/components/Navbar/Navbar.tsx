"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import {
  Menu,
  Users,
  FileText,
  Receipt,
  Info,
  ChevronRight,
  TrendingUp,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

const NavBar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Espera 200ms antes de cerrar para evitar cierres accidentales
  };
  const handleLinkClick = () => {
    setIsOpen(false);
    setExpandedItems([]);
  };

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <NavigationMenu className="NavigationMenu h-[800px] bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 h-full">
        <NavigationMenuList className="NavigationMenuList">
          {/* Logo */}
          <NavigationMenuItem className="mr-8">
            <NavigationMenuLink asChild>
              <Link
                href="/"
                className="Logo hover:bg-white/10 transition-all duration-300 rounded-lg"
                onClick={handleLinkClick}
              >
                <Image
                  src="/Img/sippa.webp"
                  alt="Logo"
                  width={150}
                  height={40}
                  className="w-auto"
                />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Menú hamburguesa (mobile) */}
          <div className="flex lg:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div
              className={`fixed inset-0 bg-black/30 bg-opacity-50 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              onClick={() => setIsOpen(false)}
            />
            <div
              className={`fixed top-0 left-0 h-full w-[250px] bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <div className="border-b border-border/40 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-3 px-4">
                  <Link
                    href="/"
                    className="w-30 relative flex-shrink-0 rounded-lg"
                    onClick={handleLinkClick}
                  >
                    <Image
                      src="/Img/sippa.webp"
                      alt="Logo"
                      width={150}
                      height={40}
                      className="w-auto"
                    />
                  </Link>
                </div>
              </div>
              <nav className="py-6">
                <div className="space-y-1">
                  <div>
                    <button
                      onClick={() => toggleExpanded("operarios")}
                      className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 flex-shrink-0" />
                        <span>Operarios</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-200 ${expandedItems.includes("operarios") ? "rotate-90" : ""
                          }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${expandedItems.includes("operarios")
                        ? "max-h-40"
                        : "max-h-0"
                        }`}
                    >
                      <Link
                        href="/operarios"
                        className="flex items-center gap-3 px-11 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={handleLinkClick}
                      >
                        <Users className="h-4 w-4" />
                        <span>Lista de Operarios</span>
                      </Link>
                      <Link
                        href="/nuevoOperario"
                        className="flex items-center gap-3 px-11 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={handleLinkClick}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Nuevo Operario</span>
                      </Link>
                    </div>
                  </div>
                  <Link
                    href="/leyeslaborales"
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <span>Leyes Laborales</span>
                  </Link>
                  <Link
                    href="/form"
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <Receipt className="h-5 w-5 flex-shrink-0" />
                    <span>Crea tu Recibo</span>
                  </Link>
                  <Link
                    href="/reportes"
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <TrendingUp className="h-5 w-5 flex-shrink-0" />
                    <span>Reportes</span>
                  </Link>
                  <Link
                    href="/acercade"
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <Info className="h-5 w-5 flex-shrink-0" />
                    <span>Acerca de</span>
                  </Link>
                </div>
              </nav>
            </div>
          </div>

          {/* Menú desktop */}
          <NavigationMenuItem className="hidden lg:flex items-center space-x-6">
            <div
              className="relative"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              <button className="flex items-center gap-2 text-white/90 hover:text-white px-3 py-2 rounded-lg transition-all duration-300">
                <Users className="w-5 h-5 text-white" />
                <span>Operarios</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180 opacity-100" : ""
                    }`}
                />
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 shadow-lg bg-blue-500 ring-1 ring-white ring-opacity-5 z-50">
                  <Link
                    href="/operarios"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <Users className="w-4 h-4" />
                    <span>Lista de Operarios</span>
                  </Link>
                  <Link
                    href="/nuevoOperario"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Nuevo Operario</span>
                  </Link>
                </div>
              )}
            </div>

            <NavigationMenuLink
              asChild
              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300"
            >
              <Link
                href="/leyeslaborales"
                onClick={handleLinkClick}
                className="flex flex-row items-center gap-2"
              >
                <FileText className="w-5 h-5 text-white" />
                <span>Leyes Laborales</span>
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink
              asChild
              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300"
            >
              <Link
                href="/form"
                onClick={handleLinkClick}
                className="flex flex-row items-center gap-2"
              >
                <Receipt className="w-5 h-5 text-white" />
                <span>Crea tu Recibo</span>
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink
              asChild
              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300"
            >
              <Link
                href="/reportes"
                onClick={handleLinkClick}
                className="flex flex-row items-center gap-2"
              >
                <TrendingUp className="w-5 h-5 text-white" />
                <span>Reportes</span>
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink
              asChild
              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300"
            >
              <Link
                href="/acercade"
                onClick={handleLinkClick}
                className="flex flex-row items-center gap-2"
              >
                <Info className="w-5 h-5 text-white" />
                <span>Acerca de</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
};

export default NavBar;
