import { useEffect, useState } from "react";

function ThemeToggle(){
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
      );
    
      useEffect(() => {
        if (darkMode) {
          document.body.classList.add("dark-mode");
          localStorage.setItem("theme", "dark");
        } else {
          document.body.classList.remove("dark-mode");
          localStorage.setItem("theme", "light");
        }
      }, [darkMode]);
    
      return (
        <label className="theme-switch">
      <span>{darkMode ? "🌙" : "☀️"}</span>
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <div className="switch"></div>
    </label>
      );


}
export default ThemeToggle;