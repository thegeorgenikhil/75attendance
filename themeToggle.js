// This block of code is being executed whenever the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("theme-toggle"); // This gets the button element via the ID (theme-toggle)
    // This stores a boolean by getting the theme saved in the localStorage and checks if it is dark, if it is dark the const is saved as true and vice-versa
    const prefersDark = localStorage.getItem("theme") == "dark"; 

    // This checks if the prefersDark is true or false. If it is true, it adds "dark" class to the body
    if (prefersDark) {
        document.body.classList.add("dark");
        toggleButton.textContent = "☀️"; // It changes the icon to light theme
    }

    // This code adds a event listener to the toggle-theme button. Which handles the theme toggle
    toggleButton.addEventListener("click", () => {
        // This checks if "dark" class is already in, if yes remove it and if no add it
        const isDark = document.body.classList.toggle("dark");
        // This stores the user's preferred theme in localStorage
        localStorage.setItem("theme", isDark ? "dark" : "light");
        // And yeah this code changes the icon depending on the theme
        toggleButton.textContent = isDark ? "☀️" : "🌙";
    });
});