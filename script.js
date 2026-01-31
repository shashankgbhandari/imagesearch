const accessKey = "VabElu27DhmD2xrLG6AM24g_k0nou44ADW-I-9YXqdk";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const results = document.getElementById("search-results");
const showMoreBtn = document.getElementById("show-more-btn");
const zeroState = document.getElementById("zeroState");
const quickSuggestions = document.getElementById("quickSuggestions");

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const downloadBtn = document.getElementById("downloadBtn");
const closeModal = document.getElementById("closeModal");

let keyword = "";
let page = 1;

async function fetchImages() {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;
    const res = await fetch(url);
    const data = await res.json();

    if (page === 1) {
        results.innerHTML = "";
        zeroState.style.display = "none";
    }

    if (data.results.length === 0 && page === 1) {
        zeroState.style.display = "block";
        showMoreBtn.style.display = "none";
        return;
    }

    data.results.forEach(img => {
        const image = document.createElement("img");
        image.src = img.urls.small;
        image.dataset.full = img.urls.full;
        results.appendChild(image);
    });

    showMoreBtn.style.display = "block";
}

function startSearch() {
    keyword = searchInput.value.trim();
    if (!keyword) return;
    page = 1;
    fetchImages();
    quickSuggestions.style.display = "none";
}

searchBtn.onclick = startSearch;

searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") startSearch();
});

searchInput.addEventListener("focus", () => {
    if (!searchInput.value) quickSuggestions.style.display = "block";
});

searchInput.addEventListener("input", () => {
    quickSuggestions.style.display = "none";
});

quickSuggestions.onclick = e => {
    const item = e.target.closest(".qs-item");
    if (item) {
        searchInput.value = item.dataset.key;
        startSearch();
    }
};

showMoreBtn.onclick = () => {
    page++;
    fetchImages();
};

results.onclick = e => {
    if (e.target.tagName === "IMG") {
        modal.style.display = "flex";
        modalImg.src = e.target.dataset.full;

        // ✅ DIRECT DOWNLOAD – ONE CLICK
        downloadBtn.onclick = async () => {
            const response = await fetch(e.target.dataset.full);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        };
    }
};

closeModal.onclick = () => modal.style.display = "none";
