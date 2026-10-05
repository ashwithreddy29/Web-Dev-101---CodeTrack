
const problemForm = document.getElementById("problemForm");
const problemNameInput = document.getElementById("problemName");
const platformInput = document.getElementById("platform");
const difficultyInput = document.getElementById("difficulty");
const statusInput = document.getElementById("status");

const problemContainer = document.getElementById("problemContainer");
const emptyState = document.getElementById("emptyState");
const formMessage = document.getElementById("formMessage");

const searchInput = document.getElementById("searchInput");
const difficultyFilter = document.getElementById("difficultyFilter");
const statusFilter = document.getElementById("statusFilter");

const totalProblems = document.getElementById("totalProblems");
const solvedProblems = document.getElementById("solvedProblems");
const pendingProblems = document.getElementById("pendingProblems");
const easyProblems = document.getElementById("easyProblems");
const mediumProblems = document.getElementById("mediumProblems");
const hardProblems = document.getElementById("hardProblems");



let problems = JSON.parse(localStorage.getItem("codetrackProblems")) || [];



function saveProblems() {
    localStorage.setItem("codetrackProblems", JSON.stringify(problems));
}



function updateStats() {
    totalProblems.textContent = problems.length;

    solvedProblems.textContent = problems.filter(function (problem) {
        return problem.status === "Solved";
    }).length;

    pendingProblems.textContent = problems.filter(function (problem) {
        return problem.status === "Pending";
    }).length;

    easyProblems.textContent = problems.filter(function (problem) {
        return problem.difficulty === "Easy";
    }).length;

    mediumProblems.textContent = problems.filter(function (problem) {
        return problem.difficulty === "Medium";
    }).length;

    hardProblems.textContent = problems.filter(function (problem) {
        return problem.difficulty === "Hard";
    }).length;
}


function getDifficultyClass(difficulty) {
    if (difficulty === "Easy") {
        return "badge-easy";
    }

    if (difficulty === "Medium") {
        return "badge-medium";
    }

    return "badge-hard";
}


function getStatusClass(status) {
    if (status === "Solved") {
        return "badge-solved";
    }

    return "badge-pending";
}


function displayProblems() {

    
    problemContainer.innerHTML = "";

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedDifficulty = difficultyFilter.value;
    const selectedStatus = statusFilter.value;

    
    const filteredProblems = problems.filter(function (problem) {

        const matchesSearch =
            problem.name.toLowerCase().includes(searchText) ||
            problem.platform.toLowerCase().includes(searchText);

        const matchesDifficulty =
            selectedDifficulty === "All" ||
            problem.difficulty === selectedDifficulty;

        const matchesStatus =
            selectedStatus === "All" ||
            problem.status === selectedStatus;

        return matchesSearch && matchesDifficulty && matchesStatus;
    });


    
    if (filteredProblems.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }


    
    filteredProblems.forEach(function (problem) {

        const card = document.createElement("article");
        card.className = "problem-card";

        card.innerHTML = `
            <div class="card-top">
                <div>
                    <h3>${escapeHTML(problem.name)}</h3>
                    <p class="platform">${escapeHTML(problem.platform)}</p>
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteProblem(${problem.id})"
                >
                    Delete
                </button>
            </div>

            <div class="badges">
                <span class="badge ${getDifficultyClass(problem.difficulty)}">
                    ${problem.difficulty}
                </span>

                <span class="badge ${getStatusClass(problem.status)}">
                    ${problem.status}
                </span>
            </div>
        `;

        problemContainer.appendChild(card);
    });

    updateStats();
}



function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}



problemForm.addEventListener("submit", function (event) {

   
    event.preventDefault();

    const problemName = problemNameInput.value.trim();
    const platform = platformInput.value;
    const difficulty = difficultyInput.value;
    const status = statusInput.value;

    
    if (
        problemName === "" ||
        platform === "" ||
        difficulty === "" ||
        status === ""
    ) {
        formMessage.textContent = "Please fill in all the fields.";
        return;
    }

    
    const newProblem = {
        id: Date.now(),
        name: problemName,
        platform: platform,
        difficulty: difficulty,
        status: status
    };

   
    problems.push(newProblem);

    
    saveProblems();
    displayProblems();

   
    problemForm.reset();

    formMessage.textContent = "Problem added successfully!";

    setTimeout(function () {
        formMessage.textContent = "";
    }, 2500);
});



function deleteProblem(id) {

    problems = problems.filter(function (problem) {
        return problem.id !== id;
    });

    saveProblems();
    displayProblems();
}



searchInput.addEventListener("input", displayProblems);
difficultyFilter.addEventListener("change", displayProblems);
statusFilter.addEventListener("change", displayProblems);



displayProblems();
