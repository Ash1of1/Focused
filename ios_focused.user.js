// ==UserScript==
// @name         Instagram Focus Mode
// @description  Blocks Reels, Explore, and Main Feed on Instagram
// @match        *://*.instagram.com/*
// @run-at       document-start
// ==/UserScript==


(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = '[data-pagelet="story_tray"], article { display: none !important; }';
    document.head.appendChild(style);
    // Apply mutation observer to nav bar

    const observer = new MutationObserver((mutations) => {
        // OPTIMIZATION: Check if we are on a page we care about
        if (window.location.pathname === '/reels/') {
            // We are on the Reels page -> Redirect immediately
            window.location.replace('/');
            return;
        }

        // LOGIC 1: Handle the Sidebar (Reels Button)
        const reelsButton = document.querySelector('a[href="/reels/"]');
        const homeButton = document.querySelector('a[href="/"]');
        const exploreButton = document.querySelector('a[href="/explore/"]');

        if (reelsButton && reelsButton.style.display !== 'none') {
            reelsButton.style.display = 'none';
        }
        if (homeButton && homeButton.style.display !== 'none') {
            homeButton.style.display = 'none';
        }
        if (exploreButton && exploreButton.style.display !== 'none') {
            exploreButton.style.display = 'none';
        } 

        // LOGIC 2: Handle the Main Feed (Suggested Posts)
        // We just check if they exist right now; we don't need a separate observer
        const suggestedPosts = document.querySelectorAll('article'); 
        suggestedPosts.forEach(post => {
            if (post && post.style.display !== 'none') {
                post.style.display = 'none';
            }
        });
    });

    // Start the one true observer
    observer.observe(document.body, {
        childList: true, // Detect when elements are added/removed
        subtree: true    // Detect changes deep inside the page (crucial for SPAs)
    });


    })();
