// File: public/js/ticker.js
document.addEventListener("DOMContentLoaded", function() {
    const tickerDiv = document.getElementById('newsTicker');

    fetch('http://localhost:3000/api/news') // Adjust if your server is hosted elsewhere
        .then(response => response.json())
        .then(newsItems => {
            tickerDiv.innerHTML = newsItems.map(news => `<span>${news.title}: ${news.summary}</span>`).join('');
            animateTicker(tickerDiv);
        })
        .catch(error => console.error('Failed to load news data:', error));

    function animateTicker(ticker) {
        ticker.style.position = 'relative';
        let shiftAmount = 0;
        setInterval(() => {
            if (shiftAmount < -ticker.scrollWidth) {
                shiftAmount = ticker.offsetWidth;
            }
            ticker.style.transform = `translateX(${shiftAmount--}px)`;
        }, 20);
    }
});
 