document.addEventListener('DOMContentLoaded', () => {
    const guestBtn = document.getElementById('guestBtn');

    guestBtn.addEventListener('click', () => {
        // 1. User Feedback - Show loading state
        guestBtn.innerHTML = "Verifying Security...";
        guestBtn.style.backgroundColor = "#555";
        
        // 2. Simulate Invisible CAPTCHA check (Bot Protection)
        setTimeout(() => {
            initializeGuestSession();
        }, 1500); // 1.5 second artificial delay for "checks"
    });
});

function initializeGuestSession() {
    // 3. Generate Random Session ID (Anonymous by Design)
    const sessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
    
    // Store in SessionStorage (Auto-clears when tab closes)
    sessionStorage.setItem('janSwasth_session', sessionId);
    sessionStorage.setItem('user_role', 'guest');

    console.log(`Session Created: ${sessionId}`);
    
    // 4. Redirect to Main App
    window.location.href = 'app.html'; 
}