// club.js - Individual club detail page with registration form
console.log("club.js loading...");

firebase.initializeApp({
    apiKey: "AIzaSyBoWwArqP6pYGvVSBzCbUnOphhzk0Pi9oQ",
    authDomain: "tekwill-441fe.firebaseapp.com",
    projectId: "tekwill-441fe",
    storageBucket: "tekwill-441fe.firebasestorage.app",
    messagingSenderId: "990223834307",
    appId: "1:990223834307:web:c1a9da67d5e5f070db1676"
});

const db = firebase.firestore();
const auth = firebase.auth();

let currentClub = null;
let allClubs = [];

// Mobile navigation setup
document.getElementById("burger").addEventListener("click", function() {
    document.getElementById("phone-nav").classList.remove("hidden");
});

document.getElementById("close").addEventListener("click", function() {
    document.getElementById("phone-nav").classList.add("hidden");
});

// Get club ID from URL
function getClubIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Club icon mapping
function getClubIcon(clubName) {
    const name = clubName.toLowerCase();
    if (name.includes('formator')) return 'ph-chalkboard-teacher';
    if (name.includes('senior')) return 'ph-heart';
    if (name.includes('creart') || name.includes('art')) return 'ph-palette';
    if (name.includes('tați') || name.includes('tatil')) return 'ph-baby';
    if (name.includes('sănătate')) return 'ph-heartbeat';
    if (name.includes('psiholog')) return 'ph-brain';
    if (name.includes('leadership')) return 'ph-crown';
    if (name.includes('design') || name.includes('vestimentar')) return 'ph-t-shirt';
    if (name.includes('tehnologie') || name.includes('inovație')) return 'ph-cpu';
    if (name.includes('nutriție')) return 'ph-apple';
    return 'ph-users-three';
}

// Load club details
async function loadClubDetails() {
    const clubId = getClubIdFromURL();
    if (!clubId) {
        window.location.href = '/cluburi.html';
        return;
    }

    try {
        const clubDoc = await db.collection('clubs').doc(clubId).get();

        if (!clubDoc.exists) {
            window.location.href = '/cluburi.html';
            return;
        }

        currentClub = { id: clubDoc.id, ...clubDoc.data() };
        document.title = `${currentClub.name} - CMIEA`;

        renderClubDetails();
        loadClubCheckboxes();
        loadOtherClubs(clubId);

        // Show registration section
        document.getElementById('registration-section').classList.remove('hidden');

    } catch (error) {
        console.error("Error loading club:", error);
        document.getElementById('club-details-container').innerHTML = `
            <div class="text-center py-12">
                <i class="ph ph-warning text-6xl text-yellow-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-700 dark:text-white mb-2">Eroare la încărcarea clubului</h2>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Nu s-a putut încărca clubul. Vă rugăm să încercați din nou.</p>
                <a href="/cluburi.html" class="px-6 py-3 bg-main text-white rounded-lg hover:bg-maindark transition-colors inline-block">
                    Înapoi la Cluburi
                </a>
            </div>
        `;
    }
}

// Render club details
function renderClubDetails() {
    const container = document.getElementById('club-details-container');
    const icon = getClubIcon(currentClub.name);

    container.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Club Info -->
            <div class="flex-1">
                <a href="/cluburi.html" class="inline-flex items-center text-main dark:text-maindark hover:underline mb-6">
                    <i class="ph ph-arrow-left mr-2"></i> Înapoi la Cluburi
                </a>
                <h1 class="text-3xl lg:text-5xl font-bold dark:text-white mb-4">${currentClub.name}</h1>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">${currentClub.description || ''}</p>

                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-main/10 dark:bg-maindark/20 rounded-xl flex items-center justify-center">
                            <i class="ph ph-clock text-main dark:text-maindark text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Program</p>
                            <p class="text-gray-900 dark:text-white font-semibold">${currentClub.schedule || 'Program flexibil'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-main/10 dark:bg-maindark/20 rounded-xl flex items-center justify-center">
                            <i class="ph ph-map-pin text-main dark:text-maindark text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Locație</p>
                            <p class="text-gray-900 dark:text-white font-semibold">Oficiul CMIEA</p>
                        </div>
                    </div>
                </div>

                <a href="#registration-section" class="mt-8 inline-block w-full sm:w-auto px-8 py-4 bg-main dark:bg-maindark text-white rounded-2xl font-semibold text-lg text-center hover:bg-maindark transition-colors">
                    Înregistrează-te acum
                </a>
            </div>

            <!-- Club Visual -->
            <div class="lg:w-2/5">
                ${currentClub.image ? `
                    <div class="rounded-2xl overflow-hidden shadow-lg h-80">
                        <img src="${currentClub.image}" alt="${currentClub.name}" class="w-full h-full object-cover">
                    </div>
                ` : `
                    <div class="rounded-2xl h-80 bg-gradient-to-br from-main/20 via-maindark/10 to-purple-300/20 dark:from-maindark/30 dark:via-main/20 dark:to-purple-600/30 flex items-center justify-center shadow-lg">
                        <i class="ph ${icon} text-8xl text-main/30 dark:text-maindark/30"></i>
                    </div>
                `}
                ${(currentClub.image2 || currentClub.image3 || currentClub.image4) ? `
                    <div class="grid grid-cols-3 gap-3 mt-3">
                        ${currentClub.image2 ? `
                            <div class="rounded-xl overflow-hidden shadow-md h-24 lg:h-28">
                                <img src="${currentClub.image2}" alt="${currentClub.name} - foto 1" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                            </div>
                        ` : `
                            <div class="rounded-xl h-24 lg:h-28 bg-gradient-to-br from-main/10 to-maindark/10 dark:from-maindark/20 dark:to-main/10 flex items-center justify-center">
                                <i class="ph ph-image text-2xl text-main/20 dark:text-maindark/20"></i>
                            </div>
                        `}
                        ${currentClub.image3 ? `
                            <div class="rounded-xl overflow-hidden shadow-md h-24 lg:h-28">
                                <img src="${currentClub.image3}" alt="${currentClub.name} - foto 2" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                            </div>
                        ` : `
                            <div class="rounded-xl h-24 lg:h-28 bg-gradient-to-br from-main/10 to-maindark/10 dark:from-maindark/20 dark:to-main/10 flex items-center justify-center">
                                <i class="ph ph-image text-2xl text-main/20 dark:text-maindark/20"></i>
                            </div>
                        `}
                        ${currentClub.image4 ? `
                            <div class="rounded-xl overflow-hidden shadow-md h-24 lg:h-28">
                                <img src="${currentClub.image4}" alt="${currentClub.name} - foto 3" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                            </div>
                        ` : `
                            <div class="rounded-xl h-24 lg:h-28 bg-gradient-to-br from-main/10 to-maindark/10 dark:from-maindark/20 dark:to-main/10 flex items-center justify-center">
                                <i class="ph ph-image text-2xl text-main/20 dark:text-maindark/20"></i>
                            </div>
                        `}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Load all clubs as checkboxes in the form
async function loadClubCheckboxes() {
    try {
        const snapshot = await db.collection('clubs').orderBy('createdAt', 'desc').get();
        allClubs = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!data.deleted) {
                allClubs.push({ id: doc.id, ...data });
            }
        });

        const container = document.getElementById('clubs-checkboxes');
        if (!container) return;

        container.innerHTML = allClubs.map(club => {
            const isCurrentClub = club.id === currentClub.id;
            return `
                <label class="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark3 transition-colors ${isCurrentClub ? 'bg-main/5 dark:bg-maindark/10 border-main/30 dark:border-maindark/30' : ''}">
                    <input type="checkbox" name="cluburiSelectate" value="${club.name}" ${isCurrentClub ? 'checked' : ''}
                        class="w-4 h-4 mt-0.5 text-main focus:ring-main rounded">
                    <div>
                        <span class="text-gray-700 dark:text-gray-300 font-medium">${club.name}</span>
                        <span class="block text-xs text-gray-500 dark:text-gray-400">${club.schedule || ''}</span>
                    </div>
                </label>
            `;
        }).join('');

    } catch (error) {
        console.error("Error loading clubs for checkboxes:", error);
    }
}

// Load other clubs for recommendations
async function loadOtherClubs(currentClubId) {
    try {
        const container = document.getElementById('other-clubs');
        if (!container) return;

        // Use allClubs if already loaded, otherwise fetch
        if (allClubs.length === 0) {
            const snapshot = await db.collection('clubs').orderBy('createdAt', 'desc').get();
            snapshot.forEach(doc => {
                const data = doc.data();
                if (!data.deleted) {
                    allClubs.push({ id: doc.id, ...data });
                }
            });
        }

        const otherClubs = allClubs.filter(c => c.id !== currentClubId).slice(0, 3);

        if (otherClubs.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center">Nu există alte cluburi disponibile.</p>';
            return;
        }

        container.innerHTML = otherClubs.map(club => {
            const icon = getClubIcon(club.name);
            return `
                <div class="bg-white dark:bg-dark2 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer" onclick="window.location.href='/club.html?id=${club.id}'">
                    <div class="h-32 bg-gradient-to-br from-main/10 via-maindark/5 to-purple-200/10 dark:from-maindark/20 dark:via-main/10 dark:to-purple-600/20 flex items-center justify-center">
                        <i class="ph ${icon} text-5xl text-main/30 dark:text-maindark/30"></i>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold dark:text-white mb-1 line-clamp-1">${club.name}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${club.schedule || ''}</p>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Error loading other clubs:", error);
    }
}

// Handle form submission
async function handleRegistrationSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Se trimite...';

    // Get form data
    const form = document.getElementById('club-registration-form');
    const formData = new FormData(form);

    // Collect selected clubs
    const selectedClubs = [];
    document.querySelectorAll('input[name="cluburiSelectate"]:checked').forEach(cb => {
        selectedClubs.push(cb.value);
    });

    if (selectedClubs.length === 0) {
        alert('Vă rugăm să selectați cel puțin un club.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Trimite Formularul';
        return;
    }

    const registrationData = {
        email: formData.get('email'),
        numePrenume: formData.get('numePrenume'),
        telefon: formData.get('telefon'),
        anulNasterii: formData.get('anulNasterii'),
        ocupatia: formData.get('ocupatia'),
        studii: formData.get('studii'),
        profesiaActuala: formData.get('profesiaActuala'),
        cluburiSelectate: selectedClubs,
        asteptari: formData.get('asteptari') || '',
        clubId: currentClub.id,
        clubName: currentClub.name,
        status: 'pending',
        registrationDate: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Add user ID if logged in
    const user = auth.currentUser;
    if (user) {
        registrationData.userId = user.uid;
    }

    try {
        await db.collection('clubRegistrations').add(registrationData);
        console.log("Club registration submitted successfully");

        // Show success modal
        const modal = document.getElementById('registration-modal');
        modal.classList.remove('hidden');

        // Reset form
        form.reset();

        // Re-check the current club checkbox
        const currentClubCheckbox = document.querySelector(`input[name="cluburiSelectate"][value="${currentClub.name}"]`);
        if (currentClubCheckbox) currentClubCheckbox.checked = true;

    } catch (error) {
        console.error("Error submitting registration:", error);
        alert('Eroare la trimiterea formularului. Vă rugăm să încercați din nou.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Trimite Formularul';
    }
}

// Pre-fill form if user is logged in
function prefillFormForUser(user) {
    if (!user) return;

    const emailField = document.getElementById('reg-email');
    if (emailField) emailField.value = user.email || '';

    // Try to get more user data from Firestore
    db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists) {
            const userData = doc.data();
            const nameField = document.getElementById('reg-name');
            const phoneField = document.getElementById('reg-phone');

            if (nameField && userData.firstName && userData.lastName) {
                nameField.value = `${userData.lastName} ${userData.firstName}`;
            }
            if (phoneField && userData.phone) {
                phoneField.value = userData.phone;
            }
        }
    }).catch(err => console.error("Error fetching user data:", err));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded in club.js");

    const style = document.createElement('style');
    style.textContent = `
        .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Load club details
    loadClubDetails();

    // Setup form submission
    const form = document.getElementById('club-registration-form');
    if (form) {
        form.addEventListener('submit', handleRegistrationSubmit);
    }

    // Setup success modal close
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('registration-modal').classList.add('hidden');
        });
    }

    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // Pre-fill form for logged-in users
    auth.onAuthStateChanged(user => {
        if (user) {
            prefillFormForUser(user);
        }
    });
});

console.log("club.js loaded successfully");