import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { messages } from './utils/messages.js';

const firebaseConfig = {
    apiKey: "AIzaSyBoWwArqP6pYGvVSBzCbUnOphhzk0Pi9oQ",
    authDomain: "tekwill-441fe.firebaseapp.com",
    projectId: "tekwill-441fe",
    storageBucket: "tekwill-441fe.firebasestorage.app",
    messagingSenderId: "990223834307",
    appId: "1:990223834307:web:c1a9da67d5e5f070db1676"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const googleSignIn = document.getElementById('googleSignIn');
    
    if (!loginForm) {
        console.error("Formularul de conectare nu a fost găsit");
        return;
    }
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginButton = document.querySelector('button[type="submit"]');
        
        try {
            loginButton.disabled = true;
            loginButton.textContent = messages.loading.login;
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            if (!user.emailVerified) {
                throw new Error(messages.loginErrors.verifyEmail);
            }
            
            window.location.href = '../index.html';
            
        } catch (error) {
            console.error("Eroare:", error);
            const errorMessage = document.getElementById('errorMessage') || document.createElement('div');
            errorMessage.id = 'errorMessage';
            errorMessage.className = 'text-red-500 text-sm mt-2';
            
            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage.textContent = messages.loginErrors.invalidCredentials;
                    break;
                case 'auth/too-many-requests':
                    errorMessage.textContent = messages.loginErrors.tooManyAttempts;
                    break;
                default:
                    errorMessage.textContent = messages.loginErrors.default;
            }
            
            loginForm.appendChild(errorMessage);
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = messages.buttons.login;
        }
    });

    const forgotPasswordBtn = document.getElementById('forgotPassword');
    const resetModal = document.getElementById('resetModal');
    const cancelResetBtn = document.getElementById('cancelReset');
    const sendResetBtn = document.getElementById('sendReset');
    const resetEmailInput = document.getElementById('resetEmail');

    forgotPasswordBtn?.addEventListener('click', () => {
        resetModal?.classList.remove('hidden');
        resetEmailInput?.focus();
    });

    cancelResetBtn?.addEventListener('click', () => {
        resetModal?.classList.add('hidden');
        resetEmailInput.value = '';
    });

    resetModal?.addEventListener('click', (e) => {
        if (e.target === resetModal) {
            resetModal.classList.add('hidden');
            resetEmailInput.value = '';
        }
    });

    sendResetBtn?.addEventListener('click', async () => {
        const email = resetEmailInput?.value?.trim();
        
        if (!email) {
            alert(messages.resetPassword.emptyEmail);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Vă rugăm să introduceți o adresă de email validă.");
            return;
        }

        try {
            sendResetBtn.disabled = true;
            sendResetBtn.textContent = messages.loading.reset;
            
            console.log('Firebase Auth instance:', auth);
            console.log('Current auth state:', auth.currentUser);
            console.log('Attempting to send password reset email to:', email);
            
            // Check if user is currently signed in
            if (auth.currentUser) {
                console.log('⚠️ User is currently signed in. Email:', auth.currentUser.email);
                console.log('⚠️ Trying to reset password for same email?', auth.currentUser.email === email);
            }
            
            // Send the reset email directly (Firebase will handle user existence check)
            console.log('🔍 Sending password reset email...');
            await sendPasswordResetEmail(auth, email);
            
            console.log('✅ Firebase sendPasswordResetEmail completed successfully');
            console.log('📧 Email should be sent to:', email);
            console.log('🔍 Debugging info:');
            console.log('   - Firebase project ID:', auth.app.options.projectId);
            console.log('   - Auth domain:', auth.app.options.authDomain);
            console.log('   - Current timestamp:', new Date().toISOString());
            
            // Show a more detailed success message
            const detailedMessage = `Email de resetare trimis către ${email}.\n\nDacă nu primești email-ul:\n1. Verifică folderul spam/junk\n2. Așteaptă până la 15 minute\n3. Verifică că ai cont cu acest email\n4. Încearcă cu alt furnizor de email`;
            
            alert(detailedMessage);
            resetModal?.classList.add('hidden');
            resetEmailInput.value = '';
        } catch (error) {
            console.error('Error sending reset email:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            let errorMessage = messages.resetPassword.error;
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "Nu există un cont cu această adresă de email.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Adresa de email nu este validă.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Prea multe cereri. Vă rugăm să încercați mai târziu.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Eroare de rețea. Verificați conexiunea la internet.";
                    break;
                default:
                    errorMessage = messages.resetPassword.error + error.message;
            }
            
            alert(errorMessage);
        } finally {
            sendResetBtn.disabled = false;
            sendResetBtn.textContent = messages.resetPassword.buttons.send;
        }
    });

    googleSignIn?.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            window.location.href = '../index.html';
        } catch (error) {
            console.error("Eroare la autentificarea cu Google:", error);
            alert(error.code === 'auth/popup-closed-by-user' 
                ? messages.googleAuthErrors.popup 
                : messages.googleAuthErrors.default + error.message);
        }
    });

    const passwordHelpText = document.querySelector('.password-help-text');
    if (passwordHelpText) {
        passwordHelpText.textContent = messages.passwordLength;
    }
});