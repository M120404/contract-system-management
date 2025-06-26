// ThemeSwitcher.jsx
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex items-center gap-2">
      <label className="swap swap-rotate">
        <input
          type="checkbox"
          onChange={toggleTheme}
          checked={theme === "dark"}
        />

        {/* Dark icon */}
        <svg
          className="swap-on fill-current w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64 17.657A9 9 0 0012 21a9 9 0 006.36-15.364A9 9 0 005.64 17.657z" />
        </svg>

        {/* Light icon */}
        <svg
          className="swap-off fill-current w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5 12a7 7 0 1114 0 7 7 0 01-14 0zm7-9v2m0 14v2m-7-7H3m16 0h2M5.64 5.64l1.42 1.42M17 17l1.42 1.42M5.64 18.36l1.42-1.42M17 7l1.42-1.42" />
        </svg>
      </label>

      {/* 👇 This line is safe because it's INSIDE the component */}
      <p className="text-sm text-gray-500">Theme: {theme}</p>
    </div>
  );
};

export default ThemeSwitcher;
