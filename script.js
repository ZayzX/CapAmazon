document.addEventListener("DOMContentLoaded", function() {
    // Initialisez EmailJS avec votre clé publique
    emailjs.init("frCyAOIJI8daXAuh8");

    const articlesData = [
        { 
            title: "Premier Article", 
            content: "Contenu du premier article...", 
            tags: ["Livre", "Blocs"],
            link: "https://example.com/article1"
        },
        { 
            title: "Deuxième Article", 
            content: "Contenu du deuxième article...", 
            tags: ["PVP"],
            link: "https://example.com/article2"
        },
        { 
            title: "Troisième Article", 
            content: "Contenu du troisième article...", 
            tags: ["Minerai", "Missile"],
            link: "https://example.com/article3"
        },
        { 
            title: "Quatrième Article", 
            content: "Contenu du quatrième article...", 
            tags: ["Mars"],
            link: "https://example.com/article4"
        },
        { 
            title: "Cinquième Article", 
            content: "Contenu du cinquième article...", 
            tags: ["Lune"],
            link: "https://example.com/article5"
        },
        { 
            title: "Sixième Article", 
            content: "Contenu du sixième article...", 
            tags: ["Lootbox", "Machine"],
            link: "https://example.com/article6"
        },
        // Ajoutez plus d'articles ici pour tester la pagination
    ];

    const articlesPerPage = 2;
    let currentPage = 1;

    const searchBar = document.getElementById("searchBar");
    const articlesContainer = document.getElementById("articlesContainer");
    const tags = document.querySelectorAll(".tag");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    const modal = document.getElementById("modal");
    const closeModal = document.getElementsByClassName("close")[0];
    const purchaseForm = document.getElementById("purchaseForm");
    let currentArticle = null;

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

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    purchaseForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const quantity = document.getElementById("quantity").value;
        const email = document.getElementById("email").value;

        // Envoi de l'email
        emailjs.send("service_03zcxso", "template_evvoeww", {
            to_email: email,
            article_title: currentArticle.title,
            article_link: currentArticle.link,
            quantity: quantity
        })
        .then(function(response) {
            alert("E-mail envoyé avec succès !");
            modal.style.display = "none";
        }, function(error) {
            alert("Échec de l'envoi de l'e-mail : " + JSON.stringify(error));
        });
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
                <button class="buy-button" data-title="${article.title}" data-link="${article.link}">Acheter</button>
            `;
            articlesContainer.appendChild(articleElement);
        });

        const buyButtons = document.querySelectorAll(".buy-button");
        buyButtons.forEach(button => {
            button.addEventListener("click", function() {
                const title = this.getAttribute("data-title");
                const link = this.getAttribute("data-link");
                currentArticle = { title, link };
                modal.style.display = "block";
            });
        });

        pageInfo.textContent = `Page ${currentPage}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * articlesPerPage >= filtered.length;
    }

    updateArticles();
});
