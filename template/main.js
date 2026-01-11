document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mailbox = document.getElementById('mailbox');
    const mailboxContainer = document.getElementById('mailboxContainer');
    const mailboxScreen = document.getElementById('mailbox-screen');
    const appScreen = document.getElementById('app-screen');
    let isOpened = false;

    // Make mailbox appear from bottom
    function showMailbox() {
        mailboxContainer.style.bottom = '0px';
    }

    // Handle mailbox interaction
    function handleMailboxInteraction() {
        if (isOpened) return;
        
        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        // Shake animation
        // mailbox.style.animation = 'shake 0.5s';
        
        // After shake, open the mailbox
        setTimeout(() => {
            mailbox.style.animation = '';
            mailbox.classList.add('open');
            isOpened = true;
            
            // // After mailbox opens, fade out and show app
            // setTimeout(() => {
            //     mailboxScreen.classList.add('fade-out');
                
            //     // Show app after fade out
            //     setTimeout(() => {
            //         mailboxScreen.classList.add('hidden');
            //         appScreen.style.display = 'block';
            //         // You can initialize your app here
            //     }, 500);
            // }, 500);
        }, 300);
    }

    // Event Listeners
    mailbox.addEventListener('click', handleMailboxInteraction);
    
    // Also allow clicking anywhere on screen
    document.addEventListener('click', function(e) {
        if (e.target === mailbox) return; // Prevent double trigger
        handleMailboxInteraction();
    });

    // Start the animation
    setTimeout(showMailbox, 1000);
});