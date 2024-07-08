document.addEventListener("DOMContentLoaded", function() {
    const articlesData = [
        { 
            title: "Ender Pearl", 
            content: "Prix : 35$/u", 
            tags: ["PVP"],
            link: "https://discord.com/channels/1259586333521874994/1259586721440596071" // Lien pour le premier article
        },
        { 
            title: "Oak Wood", 
            content: "Prix : 0.50$/u", 
            tags: ["Blocs"],
            link: "https://discord.com/channels/1259586333521874994/1259587189877243924" // Lien pour le deuxième article
        },
        { 
            title: "Armor Book", 
            content: "Prix : 250$/u", 
            tags: ["Livre", "PVP"],
            link: "https://discord.com/channels/1259586333521874994/1259588071746437120" // Lien pour le troisième article
        },
        { 
            title: "Tools Book", 
            content: "Prix : 100$/u", 
            tags: ["Livre"],
            link: "https://discord.com/channels/1259586333521874994/1259869208003481720" // Lien pour le quatrième article
        },
        { 
            title: "Classic Lootbox ",  
            content: "prix : 1500$/u", 
            tags: ["Lootbox"],
            link: "https://discord.com/channels/1259586333521874994/1259909828487417968" // Lien pour le cinquième article
        },
        { 
            title: "Legendary Lootbox", 
            content: "15K$/u", 
            tags: ["Lootbox"],
            link: "https://discord.com/channels/1259586333521874994/1259909872451981363" // Lien pour le sixième article
        },
        // Ajoutez plus d'articles ici pour tester la pagination
    ];

    const articlesPerPage = 3;
    let currentPage = 1;

    const searchBar = document.getElementById("searchBar");
    const articlesContainer = document.getElementById("articlesContainer");
    const tags = document.querySelectorAll(".tag");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    searchBar.addEventListener("keyup", updateArticles);
    tags.forEach(tag => {
        tag.addEventListener("click", function() {
            tag.classList.toggle("active");
            updateArticles();
        });
    });

    prevPageButton.addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            updateArticles();
        }
    });

    nextPageButton.addEventListener("click", function() {
        if (currentPage * articlesPerPage < filteredArticles().length) {
            currentPage++;
            updateArticles();
        }
    });

    function filteredArticles() {
        const query = searchBar.value.toLowerCase();
        const activeTags = Array.from(tags)
                                .filter(tag => tag.classList.contains("active"))
                                .map(tag => tag.getAttribute("data-tag").toLowerCase());

        return articlesData.filter(article => {
            const title = article.title.toLowerCase();
            const articleTags = article.tags.map(tag => tag.toLowerCase());

            const matchesQuery = title.includes(query);
            const matchesTags = activeTags.length === 0 || activeTags.some(tag => articleTags.includes(tag));

            return matchesQuery && matchesTags;
        });
    }

    function updateArticles() {
        const filtered = filteredArticles();
        const start = (currentPage - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const paginatedArticles = filtered.slice(start, end);

        articlesContainer.innerHTML = "";
        paginatedArticles.forEach(article => {
            const articleElement = document.createElement("div");
            articleElement.className = "article";
            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p>${article.content}</p>
                <div class="tags">Tags: ${article.tags.join(", ")}</div>
                <br>
                <button class="buy-button" onclick="window.location.href='${article.link}'">Acheter</button>
            `;
            articlesContainer.appendChild(articleElement);
        });

        pageInfo.textContent = `Page ${currentPage}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * articlesPerPage >= filtered.length;
    }

    updateArticles();
});
