document.addEventListener('DOMContentLoaded', function() {
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            fetch('/toggle-like/' + projectId, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const likesSpan = this.querySelector('span');
                    if (data.liked) {
                        likesSpan.textContent = parseInt(likesSpan.textContent) + 1;
                        this.classList.add('liked');
                    } else {
                        likesSpan.textContent = Math.max(0, parseInt(likesSpan.textContent) - 1); // Prevent like count from going below zero
                        this.classList.remove('liked');
                    }
                    // Update button text or icon here if needed
                    // Example: this.innerHTML = data.liked ? 'Unlike <span>...</span>' : 'Like <span>...</span>';
                } else {
                    console.error('Failed to toggle like:', data.message);
                    // Show an error message somewhere on your page or log it to the console
                }
            })
            .catch(err => {
                console.error('Error toggling like:', err);
                // Optionally update the UI to show the error
            });
        });
    });
});
