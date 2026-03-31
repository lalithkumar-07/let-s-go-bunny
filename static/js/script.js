// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.background = "rgba(0, 0, 0, 0.3)";
        navbar.style.backdropFilter = "blur(15px)";
    } else {
        navbar.style.background = "rgba(255, 255, 255, 0.08)";
        navbar.style.backdropFilter = "blur(12px)";
    }
});


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});


// ===== GLOBE → MAP TRANSITION =====
const globeSection = document.querySelector("#globe");
const mapSection = document.querySelector("#map");

let globeTriggered = false;

window.addEventListener("scroll", () => {
    if (!globeSection || !mapSection) return;

    const globeTop = globeSection.getBoundingClientRect().top;

    if (globeTop < window.innerHeight / 2 && !globeTriggered) {
        globeTriggered = true;

        setTimeout(() => {
            mapSection.scrollIntoView({ behavior: "smooth" });
        }, 2000);
    }
});


// ===== FADE-IN ANIMATION =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".map-section, .globe-section, .packages-section").forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
});


// ===== LOCATIONS =====
const locations = [
    "Delhi", "Mumbai", "Hyderabad", "Bangalore",
    "Chennai", "Kolkata", "Ahmedabad",
    "Pune", "Jaipur", "Lucknow"
];


// ===== DROPDOWN SETUP =====
function setupDropdown(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    if (!input || !dropdown) return;

    input.addEventListener("focus", () => renderDropdown(input, dropdown));
    input.addEventListener("input", () => renderDropdown(input, dropdown));

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });
}
// ===== RENDER DROPDOWN =====
function renderDropdown(input, dropdown) {
    const value = input.value.toLowerCase();
    dropdown.innerHTML = "";

    const filtered = locations.filter(loc =>
    loc.toLowerCase().startsWith(value)
);

    if (filtered.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    filtered.forEach(loc => {
        const item = document.createElement("div");
        item.textContent = loc;

        item.addEventListener("click", () => {
            input.value = loc;
            dropdown.style.display = "none";
        });

        dropdown.appendChild(item);
    });

    dropdown.style.display = "block";
}


// INIT DROPDOWNS
setupDropdown("fromInput", "fromDropdown");
setupDropdown("toInput", "toDropdown");


// ===== FORM SUBMIT (FINAL CLEAN VERSION) =====
const form = document.querySelector(".route-form");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const from = document.getElementById("fromInput")?.value.trim();
        const to = document.getElementById("toInput")?.value.trim();

        if (!from || !to) {
            alert("Please enter both locations.");
            return;
        }

        console.log("From:", from);
        console.log("To:", to);

        // Scroll to packages
        const packages = document.getElementById("packages");
        if (packages) {
            packages.scrollIntoView({ behavior: "smooth" });
        }
    });
}