/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Oura Ring inspired color palette
        primary: "#5D4FEB", // Purple/indigo primary color
        secondary: "#9D8DF9", // Lighter purple accent
        background: "#121212", // Dark background
        card: "#1E1E1E", // Slightly lighter card background
        text: "#FFFFFF", // White text
        textSecondary: "#B3B3B3", // Light gray secondary text
        border: "#333333", // Dark gray border
        success: "#4CAF50", // Green for success states
        warning: "#FFC107", // Amber for warnings
        error: "#F44336", // Red for errors
        inactive: "#757575", // Gray for inactive states
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
