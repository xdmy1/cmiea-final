// cluburi.js - Clubs listing page
console.log("cluburi.js loading...");

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

let allClubs = [];

// Mobile navigation setup
document.getElementById("burger").addEventListener("click", function() {
    document.getElementById("phone-nav").classList.remove("hidden");
});

document.getElementById("close").addEventListener("click", function() {
    document.getElementById("phone-nav").classList.add("hidden");
});

// Load all clubs from Firestore
async function loadClubs() {
    try {
        console.log("Loading clubs from Firestore...");

        const clubsCollection = db.collection("clubs");
        const querySnapshot = await clubsCollection.orderBy("createdAt", "desc").get();

        allClubs = [];
        querySnapshot.forEach((doc) => {
            const clubData = doc.data();
            if (!clubData.deleted) {
                allClubs.push({
                    id: doc.id,
                    ...clubData
                });
            }
        });

        console.log("Clubs loaded:", allClubs.length);

        renderClubsGrid();

    } catch (error) {
        console.error("Error loading clubs:", error);
        showFallbackContent();
    }
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

// Render clubs grid
function renderClubsGrid() {
    const container = document.getElementById('clubs-grid');
    const noClubsMessage = document.getElementById('no-clubs-message');

    if (allClubs.length === 0) {
        container.innerHTML = '';
        if (noClubsMessage) noClubsMessage.classList.remove('hidden');
        return;
    }

    if (noClubsMessage) noClubsMessage.classList.add('hidden');

    container.innerHTML = allClubs.map(club => {
        const icon = getClubIcon(club.name);
        const placeholderImage = club.image || '';

        return `
            <div class="w-full bg-white dark:bg-dark2 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden group cursor-pointer" onclick="window.location.href='/club.html?id=${club.id}'">
                ${placeholderImage ? `
                    <div class="h-48 overflow-hidden">
                        <img src="${placeholderImage}" alt="${club.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                    </div>
                ` : `
                    <div class="h-48 bg-gradient-to-br from-main/20 via-maindark/10 to-purple-300/20 dark:from-maindark/30 dark:via-main/20 dark:to-purple-600/30 flex items-center justify-center">
                        <i class="ph ${icon} text-6xl text-main/40 dark:text-maindark/40 group-hover:scale-110 transition-transform duration-300"></i>
                    </div>
                `}
                <div class="p-5">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">${club.name}</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">${club.description || ''}</p>
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <i class="ph ph-clock text-main dark:text-maindark mr-2"></i>
                        <span>${club.schedule || 'Program flexibil'}</span>
                    </div>
                    <button class="w-full bg-main dark:bg-maindark hover:bg-maindark text-white rounded-lg py-2.5 text-sm font-medium transition-colors">
                        Înregistrează-te
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Show fallback content when Firebase fails
function showFallbackContent() {
    const container = document.getElementById('clubs-grid');
    if (container) {
        container.innerHTML = `
            <div class="col-span-full bg-white dark:bg-dark2 rounded-xl p-8 text-center shadow-lg">
                <i class="ph ph-warning text-6xl text-yellow-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-700 dark:text-white mb-2">Eroare la încărcarea cluburilor</h2>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Nu s-au putut încărca cluburile. Vă rugăm să încercați din nou.</p>
                <button onclick="location.reload()" class="px-6 py-3 bg-main text-white rounded-lg hover:bg-maindark transition-colors">
                    Reîncarcă pagina
                </button>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM content loaded in cluburi.js");

    const style = document.createElement('style');
    style.textContent = `
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    loadClubs();
});

console.log("cluburi.js loaded successfully");