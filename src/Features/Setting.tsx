import { useState, useEffect } from "react";
import { Palette, Check, Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "default";
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme-mode") === "dark";
  });

  const themes = [
    { id: "default", name: "Xanh dương", colorClass: "bg-blue-500" },
    { id: "purple", name: "Tím Cyber", colorClass: "bg-purple-500" },
    { id: "emerald", name: "Xanh lục", colorClass: "bg-emerald-500" },
    { id: "amber", name: "Vàng hổ phách", colorClass: "bg-amber-500" },
  ];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("app-theme", currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme-mode", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Card className="w-full p-4 md:p-5">
      <div className="flex items-center gap-2 border-b pb-3">
        <Palette className="w-4 h-4 text-primary" />
        <h3 className="text-sm text-card-foreground">Màu chủ đề</h3>
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {themes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <motion.button key={t.id} type="button" onClick={() => setCurrentTheme(t.id)} whileTap={{ scale: 0.95 }} title={t.name} className={`w-7 h-7 rounded-full ${t.colorClass} shadow-sm ring-2 ring-offset-1 transition-all ${isSelected ? "ring-primary scale-110" : "ring-transparent hover:ring-muted-foreground/30"}`}>
                  {isSelected && <Check className="w-3.5 h-3.5 mx-auto text-white" />}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
            <span className="text-sm text-card-foreground font-medium">{darkMode ? "Tối" : "Sáng"}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant={!darkMode ? "default" : "outline"} onClick={() => setDarkMode(false)}>
              <Sun className="w-3.5 h-3.5 mr-1.5" />
              Sáng
            </Button>
            <Button size="sm" variant={darkMode ? "default" : "outline"} onClick={() => setDarkMode(true)}>
              <Moon className="w-3.5 h-3.5 mr-1.5" />
              Tối
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
