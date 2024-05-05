document.getElementById('toggleTheme').addEventListener('click', function() {
    const body = document.body;
    const nav = document.querySelector('.navbar');
    body.classList.toggle('bg-dark');
    body.classList.toggle('bg-light');
    nav.classList.toggle('bg-dark');
    nav.classList.toggle('bg-light');

    document.body.classList.toggle('dark-mode');
    this.textContent = body.classList.contains('bg-dark') ? 'Light Mode' : 'Dark Mode';
});
