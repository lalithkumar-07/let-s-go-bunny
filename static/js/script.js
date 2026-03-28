// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(0, 0, 0, 0.3)";
        navbar.style.backdropFilter = "blur(15px)";
    } else {
        navbar.style.background = "rgba(255, 255, 255, 0.08)";
        navbar.style.backdropFilter = "blur(12px)";
    }
});


// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// ===== GLOBE → MAP TRANSITION (BASIC) =====
const globeSection = document.querySelector("#globe");
const mapSection = document.querySelector("#map");

let globeTriggered = false;

window.addEventListener("scroll", () => {
    const globeTop = globeSection.getBoundingClientRect().top;

    // When globe is in center of screen
    if (globeTop < window.innerHeight / 2 && !globeTriggered) {
        globeTriggered = true;

        console.log("🌍 Globe reached center");

        // OPTIONAL: Auto scroll to map after delay
        setTimeout(() => {
            mapSection.scrollIntoView({
                behavior: "smooth"
            });
        }, 2500); // adjust timing
    }
});


// ===== FORM SUBMISSION (FRONTEND ONLY FOR NOW) =====
const form = document.querySelector(".route-form");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll("input");
        const from = inputs[0].value.trim();
        const to = inputs[1].value.trim();

        if (!from || !to) {
            alert("Please enter both locations.");
            return;
        }

        console.log("From:", from);
        console.log("To:", to);

        // TEMP FEEDBACK
        alert(`Searching routes from ${from} to ${to} 🚚`);

        // Later → send to backend
    });
}


// ===== OPTIONAL: FADE-IN EFFECT ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".map-section, .globe-section").forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
});
// ===== LOCATIONS LIST =====
const locations = [
    "Delhi", "Mumbai", "Hyderabad", "Bangalore",
    "Chennai", "Kolkata", "Ahmedabad",
    "Pune", "Jaipur", "Lucknow"
];

// ===== DROPDOWN FUNCTION =====
function setupDropdown(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    input.addEventListener("focus", () => {
        showDropdown(input, dropdown);
    });

    input.addEventListener("input", () => {
        showDropdown(input, dropdown);
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });
}

function showDropdown(input, dropdown) {
    const value = input.value.toLowerCase();
    dropdown.innerHTML = "";

    const filtered = locations.filter(loc =>
        loc.toLowerCase().includes(value)
    );

    filtered.forEach(loc => {
        const item = document.createElement("div");
        item.textContent = loc;

        item.onclick = () => {
            input.value = loc;
            dropdown.style.display = "none";
        };

        dropdown.appendChild(item);
    });

    dropdown.style.display = "block";
}

// INIT
setupDropdown("fromInput", "fromDropdown");
setupDropdown("toInput", "toDropdown");


// ===== FORM SUBMIT → SCROLL TO PACKAGES =====
const form = document.querySelector(".route-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("packages").scrollIntoView({
        behavior: "smooth"
    });
});