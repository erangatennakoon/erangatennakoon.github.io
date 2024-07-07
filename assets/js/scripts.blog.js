document.addEventListener('DOMContentLoaded', function () {
    const articles = document.querySelectorAll('.article');
    const notification = document.getElementById('notification');
    const headerText = document.querySelector('.header-text');
    const icons = document.querySelectorAll('.custom-icon');

    icons.forEach(icon => {
        icon.addEventListener('mouseover', function () {
            this.setAttribute('data-title', this.getAttribute('title'));
            this.removeAttribute('title');
        });

        icon.addEventListener('mouseout', function () {
            this.setAttribute('title', this.getAttribute('data-title'));
            this.removeAttribute('data-title');
        });
    })

    let totalReadingTime = 0; // Initialize total reading time

    articles.forEach(article => {
        const readMoreLink = article.querySelector('.read-more');
        const readLessLink = article.querySelector('.read-less');
        const intro = article.querySelector('.intro');
        const content = article.querySelector('.content');
        const titleElement = article.querySelector('.title');
        const shareTwitter = article.querySelector('.share-twitter');
        const copyLink = article.querySelector('.copy-link');
        const articleRead = article.querySelector('#article-read');

        if (readMoreLink && readLessLink && intro && content && titleElement && shareTwitter && copyLink && articleRead) {
            const articleTitle = titleElement.textContent.trim(); // Get the article title

            // Calculate and set the reading time
            const wordCount = content.textContent.trim().split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
            articleRead.textContent = `Quick ${readingTime}-minute read!`;

            // Add to total reading time
            totalReadingTime += readingTime;

            readMoreLink.addEventListener('click', function () {
                expandArticle(article);
            });

            readLessLink.addEventListener('click', function () {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
                content.addEventListener('transitionend', function () {
                    content.classList.remove('show');
                }, { once: true });

                intro.style.maxHeight = '7rem';

                readMoreLink.style.display = 'inline-block';
                readLessLink.style.display = 'none';
            });

            // Share on Twitter functionality
            shareTwitter.addEventListener('click', function () {
                const articleUrl = window.location.origin + window.location.pathname + '?article=' + article.id;
                const twitterText = encodeURIComponent(articleTitle + ' - ' + articleUrl); // Combine title and URL
                const twitterUrl = 'https://twitter.com/intent/tweet?text=' + twitterText;
                window.open(twitterUrl, '_blank');
            });

            // Copy link functionality
            copyLink.addEventListener('click', function () {
                const articleUrl = window.location.origin + window.location.pathname + '?article=' + article.id;
                navigator.clipboard.writeText(articleUrl).then(() => {
                    showNotification();
                }).catch(err => {
                    console.error('Failed to copy link: ', err);
                });
            });

            // Check for URL parameter to expand article
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('article');
            if (articleId && article.id === articleId) {
                expandArticle(article);
                const titleToScroll = titleElement;
                if (titleToScroll) {
                    const headerHeight = document.querySelector('.floating-header').offsetHeight;
                    const titlePosition = titleToScroll.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    window.scrollTo({ top: titlePosition, behavior: 'smooth' });
                }
            }
        }
    });

    // Update header text with total reading time
    headerText.textContent = `${totalReadingTime} minute${totalReadingTime > 1 ? 's' : ''} of reads ahead!`;

    function expandArticle(article) {
        const content = article.querySelector('.content');
        const readMoreLink = article.querySelector('.read-more');
        const readLessLink = article.querySelector('.read-less');
        const intro = article.querySelector('.intro');

        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        content.classList.add('show');

        readMoreLink.style.display = 'none';
        readLessLink.style.display = 'inline-block';

        intro.style.maxHeight = 'none'; // Show the full intro
    }

    function showNotification() {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000); // Adjust the duration as needed
    }
});
