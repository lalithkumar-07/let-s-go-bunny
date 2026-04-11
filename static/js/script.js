// ===============================
// NAVBAR SCROLL EFFECT
// ===============================
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.background = "rgba(10, 25, 47, 0.6)";
        navbar.style.backdropFilter = "blur(12px)";
    } else {
        navbar.style.background = "transparent";
        navbar.style.backdropFilter = "blur(0px)";
    }
});


// ===============================
// SMOOTH SCROLL
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });


// ===============================
// SECTION FADE-IN (FIXED)
// ===============================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".globe-section, .map-section, .packages-section")
.forEach(section => {
    section.classList.remove("hidden"); // IMPORTANT FIX
    observer.observe(section);
});


// ===============================
// LOCATIONS DATA
// ===============================
const locations = [
    "Delhi", "Mumbai", "Hyderabad", "Bangalore",
    "Chennai", "Kolkata", "Ahmedabad",
    "Pune", "Jaipur", "Lucknow",
    "Surat", "Indore", "Bhopal", "Patna"
];


// ===============================
// SMART DROPDOWN (SEARCH ENGINE STYLE)
// ===============================
function setupDropdown(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    if (!input || !dropdown) return;

    input.addEventListener("input", () => {
        const value = input.value.toLowerCase().trim();
        dropdown.innerHTML = "";

        if (!value) {
            dropdown.style.display = "none";
            return;
        }

        const filtered = locations.filter(loc =>
            loc.toLowerCase().includes(value)
        );

        if (filtered.length === 0) {
            dropdown.style.display = "none";
            return;
        }

        filtered.forEach(loc => {
            const item = document.createElement("div");
            item.classList.add("dropdown-item");
            item.textContent = loc;

            item.addEventListener("click", () => {
                input.value = loc;
                dropdown.style.display = "none";
            });

            dropdown.appendChild(item);
        });

        dropdown.style.display = "block";
    });

    // Close dropdown
    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });
}


// INIT DROPDOWNS
setupDropdown("fromInput", "fromDropdown");
setupDropdown("toInput", "toDropdown");


// ===============================
// FORM SUBMIT (UPGRADED)
// ===============================
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

        // Store values (for next page or map)
        localStorage.setItem("from", from);
        localStorage.setItem("to", to);

        console.log("From:", from);
        console.log("To:", to);

        // Smooth scroll to packages
        const packages = document.getElementById("packages");
        if (packages) {
            packages.scrollIntoView({ behavior: "smooth" });
        }
    });
}


// ===============================
// PACKAGE CLICK → FUTURE ROUTING PAGE
// ===============================
document.querySelectorAll(".package-card button").forEach(btn => {
    btn.addEventListener("click", () => {

        const from = localStorage.getItem("from");
        const to = localStorage.getItem("to");

        if (!from || !to) {
            alert("Please select route first.");
            return;
        }

        // FUTURE PAGE (you will create next)
        window.location.href = "/route-map";
    });
});