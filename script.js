const accessKey = "VabElu27DhmD2xrLG6AM24g_k0nou44ADW-I-9YXqdk"; 

const searchForm = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const searchResult = document.getElementById("search-results");
const showMoreBtn = document.getElementById("show-more-btn");
const searchBtn = document.getElementById("search-btn");

let keyword = "";
let page = 1;

async function searchImages() {
    keyword = searchInput.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    const response = await fetch(url);
    const data = await response.json();

    if(page === 1){
        searchResult.innerHTML = "";
    }

    const results = data.results;

    results.map((result) => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add("search-result");
        
        const image = document.createElement('img');
        image.src = result.urls.small;
        image.alt = result.alt_description;
        
        // Container for links and buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add("button-container");

        // The View Link
        const imageLink = document.createElement('a');
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = "View on Unsplash";

        // The Download Button
        const downloadBtn = document.createElement('button');
        downloadBtn.classList.add("download-btn");
        downloadBtn.textContent = "Download";
        
        // Add click event to trigger download
        downloadBtn.addEventListener('click', () => {
            downloadImage(result.urls.full, result.id); // Downloading the Full resolution image
        });

        buttonContainer.appendChild(imageLink);
        buttonContainer.appendChild(downloadBtn);

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(buttonContainer);
        searchResult.appendChild(imageWrapper);
    });
    showMoreBtn.style.display = "block";
}

// Function to handle the actual downloading
async function downloadImage(imgUrl, imgName) {
    try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Suggest a filename
        a.download = `photo-${imgName}.jpg`; 
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Download failed:', error);
        alert("Could not download image. It might be blocked by CORS policy.");
    }
}

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        page = 1;
        searchImages();
    }
});

showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages();
});