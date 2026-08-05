"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("me-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default Dark Mode
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (t: "dark" | "light") => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("me-theme", newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return <div className="w-8 h-8" />; // Render placeholder to prevent layout shift
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full border border-gray-300 dark:border-[#2a2a2a] bg-white/50 dark:bg-[#141414]/80 text-[#171717] dark:text-[#F3A6BE] hover:border-[#C9A45C] dark:hover:border-[#D4AF6A] transition-all shadow-xs flex items-center justify-center group"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[#F3A6BE] group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-[#C9A45C] group-hover:-rotate-12 transition-transform duration-300 fill-current" />
      )}
    </button>
  );
}
