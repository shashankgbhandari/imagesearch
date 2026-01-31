const accessKey = "VabElu27DhmD2xrLG6AM24g_k0nou44ADW-I-9YXqdk";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const results = document.getElementById("search-results");
const showMoreBtn = document.getElementById("show-more-btn");
const zeroState = document.getElementById("zeroState");

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
        image.dataset.download = img.links.download;
        results.appendChild(image);
    });

    showMoreBtn.style.display = "block";
}

/* Start Search */
function startSearch() {
    keyword = searchInput.value.trim();
    if (!keyword) return;
    page = 1;
    fetchImages();
}

searchBtn.onclick = startSearch;

/* ENTER key */
searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        startSearch();
    }
});

/* Show More */
showMoreBtn.onclick = () => {
    page++;
    fetchImages();
};

/* Image Modal */
results.onclick = e => {
    if (e.target.tagName === "IMG") {
        modal.style.display = "flex";
        modalImg.src = e.target.dataset.full;
        downloadBtn.href = e.target.dataset.download;
    }
};

closeModal.onclick = () => modal.style.display = "none";

/* Trending & Did You Mean */
document.addEventListener("click", e => {
    if (e.target.dataset.key) {
        searchInput.value = e.target.dataset.key;
        startSearch();
    }
});
