export const messages = {
    passwordLength: "Parola trebuie să conțină cel puțin 6 caractere",
    emailVerification: {
        success: "Cont creat cu succes!",
        checkEmail: "Vă rugăm să vă verificați email-ul pentru a activa contul.",
        redirect: "Veți fi redirecționat către pagina de autentificare în câteva secunde...",
    },
    loginErrors: {
        verifyEmail: "Vă rugăm să vă verificați email-ul înainte de autentificare. Verificați căsuța de email pentru link-ul de verificare.",
        invalidCredentials: "Email sau parolă incorectă",
        tooManyAttempts: "Prea multe încercări de autentificare. Vă rugăm să încercați mai târziu.",
        default: "A apărut o eroare. Vă rugăm să încercați din nou."
    },
    registerErrors: {
        emailInUse: "Acest email este deja folosit",
        invalidEmail: "Adresa de email nu este validă",
        weakPassword: "Parola este prea slabă",
        default: "A apărut o eroare la crearea contului. Vă rugăm să încercați din nou."
    },
    googleAuthErrors: {
        popup: "Fereastra de autentificare a fost închisă. Vă rugăm să încercați din nou.",
        default: "Eroare la autentificarea cu Google: "
    },
    loading: {
        login: "Se conectează...",
        register: "Se creează contul...",
        google: "Se conectează cu Google...",
        reset: "Se trimite..."
    },
    buttons: {
        login: "Conectare",
        register: "Înregistrare",
        forgotPassword: "Ai uitat parola?"
    },
    resetPassword: {
        emptyEmail: "Vă rugăm să introduceți adresa de email.",
        success: "Email-ul de resetare a parolei a fost trimis! Verificați căsuța de email și folderul spam/junk. Dacă nu primiți email-ul în 5-10 minute, verificați că adresa de email este corectă și că aveți un cont cu această adresă.",
        error: "Eroare la trimiterea email-ului de resetare: ",
        buttons: {
            send: "Trimite"
        }
    }
};