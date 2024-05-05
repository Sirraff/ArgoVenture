document.addEventListener('DOMContentLoaded', function() {
    const themeToggleButton = document.getElementById('toggleTheme');
    const currentTheme = localStorage.getItem('theme') || 'bg-light';

    function applyTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
        themeToggleButton.textContent = theme === 'bg-dark' ? 'Light Mode' : 'Dark Mode';
    }

    applyTheme(currentTheme);

    themeToggleButton.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('bg-light') ? 'bg-dark' : 'bg-light';
        applyTheme(newTheme);
    });

    auth.onAuthStateChanged(user => {
        updateAuthUI(user);
    });
});

function updateAuthUI(user) {
    const signInButton = document.getElementById("signInButton");
    const signOutButton = document.getElementById("signOutButton");
    const userImage = document.getElementById("userImage");
    const userName = document.getElementById("userName");
    const addProjectLink = document.getElementById("addProjectLink");
    const myProjectsLink = document.getElementById("myProjectLink");
    const myTeamsLink = document.getElementById("myTeams");

    const elementsToShow = user ? ['none', 'block', 'block'] : ['block', 'none', 'none'];
    signInButton.style.display = elementsToShow[0];
    signOutButton.style.display = elementsToShow[1];
    userImage.src = user ? user.photoURL || 'path_to_default_image' : '';
    userImage.style.display = elementsToShow[2];
    userName.textContent = user ? user.displayName || user.email : '';
    userName.style.display = elementsToShow[2];
    addProjectLink.style.display = user ? 'block' : 'none';
    myProjectsLink.style.display = user ? 'block' : 'none';
    myTeamsLink.style.display = user ? 'block' : 'none';
}
