// Seleccionamos el botón
const toggleButton = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

const updateIcon = (theme) => {
    toggleButton.textContent = theme === 'light' ? '☀️' : '🌙';
};

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);
}

toggleButton.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateIcon('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateIcon('light');
    }
});
