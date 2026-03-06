class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    add(data) {
        const node = new Node(data);
        if (!this.head) {
            this.head = node;
            return;
        }
        let current = this.head;
        while (current.next) current = current.next;
        current.next = node;
    }

    toArray() {
        let arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.data);
            current = current.next;
        }
        return arr;
    }

    size() {
        return this.toArray().length;
    }
}

let resumes = new LinkedList();
let currentRole = null;
let lastResults = [];

window.onload = function () {
    const stored = JSON.parse(localStorage.getItem("resumes")) || [];
    stored.forEach(r => resumes.add(r));
    updateDashboard();
};

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function loginUser() {
    currentRole = "user";
    document.getElementById("navbar").style.display = "flex";
    document.getElementById("analyzeNav").style.display = "none";
    document.getElementById("resultNav").style.display = "none";
    document.querySelectorAll(".company-only").forEach(e => e.style.display = "none");
    showSection("dashboard");
}

function loginCompany() {
    currentRole = "company";
    document.getElementById("navbar").style.display = "flex";
    document.getElementById("analyzeNav").style.display = "block";
    document.getElementById("resultNav").style.display = "block";
    document.querySelectorAll(".company-only").forEach(e => e.style.display = "block");
    showSection("dashboard");
}

function logout() {
    currentRole = null;
    document.getElementById("navbar").style.display = "none";
    showSection("login");
}

function addResume() {
    if (currentRole !== "user") return alert("Only users can upload");

    const name = document.getElementById("name").value;
    const skills = +document.getElementById("skills").value;
    const exp = +document.getElementById("exp").value;

    if (!name) return;

    resumes.add({ name, skills, exp });
    localStorage.setItem("resumes", JSON.stringify(resumes.toArray()));
    updateDashboard();

    document.getElementById("name").value = "";
    document.getElementById("skills").value = "";
    document.getElementById("exp").value = "";
}

function analyze() {
    if (currentRole !== "company") return alert("Only company can analyze");

    const reqSkills = +document.getElementById("reqSkills").value;
    const minExp = +document.getElementById("minExp").value;

    let arr = resumes.toArray();

    arr.forEach(r => {
        r.match = Math.min((r.skills / reqSkills) * 100, 100).toFixed(0);
        r.score = r.match * 1 + r.exp * 5;
        r.status = (r.skills >= reqSkills && r.exp >= minExp) ? "Shortlisted" : "Rejected";
    });

    arr.sort((a, b) => b.score - a.score);
    lastResults = arr;
    displayResults(arr);
    updateDashboard(arr);
    showSection("result");
}

function displayResults(arr) {
    const container = document.getElementById("resultsContainer");
    container.innerHTML = "";

    arr.forEach(r => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${r.name}</h3>
            <p>Skills: ${r.skills} | Experience: ${r.exp}</p>
            <p>Match: ${r.match}%</p>
            <div class="progress">
                <div class="progress-bar" style="width:${r.match}%"></div>
            </div>
            <span class="badge ${r.status === 'Shortlisted' ? 'green' : 'red'}">
                ${r.status}
            </span>
        `;

        container.appendChild(card);
    });
}

function updateDashboard(arr = []) {
    document.getElementById("totalResumes").innerText = resumes.size();

    if (currentRole === "company" && arr.length > 0) {
        const shortlisted = arr.filter(r => r.status === "Shortlisted").length;
        const rejected = arr.filter(r => r.status === "Rejected").length;

        document.getElementById("shortlistedCount").innerText = shortlisted;
        document.getElementById("rejectedCount").innerText = rejected;
    }
}

function searchCandidate() {
    const val = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll("#resultsContainer .card");

    cards.forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(val) ? "block" : "none";
    });
}

function sortResults(type) {
    if (!lastResults.length) return;

    if (type === "skills") lastResults.sort((a, b) => b.skills - a.skills);
    if (type === "exp") lastResults.sort((a, b) => b.exp - a.exp);
    if (type === "score") lastResults.sort((a, b) => b.score - a.score);

    displayResults(lastResults);
}

function toggleTheme() {
    document.body.classList.toggle("light");
}

/* COMPANY ONLY CLEAR DATA */
function clearData() {

    if (currentRole !== "company") {
        alert("Only company can delete all data.");
        return;
    }

    if (!confirm("Are you sure you want to delete all resumes?")) return;

    localStorage.removeItem("resumes");
    resumes = new LinkedList();
    lastResults = [];

    document.getElementById("totalResumes").innerText = 0;
    document.getElementById("shortlistedCount").innerText = 0;
    document.getElementById("rejectedCount").innerText = 0;
    document.getElementById("resultsContainer").innerHTML = "";

    alert("All resume data cleared successfully.");
}