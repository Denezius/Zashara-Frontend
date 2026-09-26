/* =========================================================
   ZASHARA — Buyer's Dashboard interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", function ()
{
    /* -----------------------------------------------------
       1. Quick-nav tile scrolling
    ----------------------------------------------------- */
    const quickNavItems = document.querySelectorAll(".zashara-quick-nav-item");

    quickNavItems.forEach(function (item)
    {
        item.addEventListener("click", function ()
        {
            const targetId = item.dataset.target;
            const targetSection = document.getElementById(targetId);

            if (targetSection)
            {
                targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });


    /* -----------------------------------------------------
       2. Hero "Explore Now" → scroll to categories
    ----------------------------------------------------- */
    const exploreNowButton = document.getElementById("explore-now");

    if (exploreNowButton)
    {
        exploreNowButton.addEventListener("click", function ()
        {
            document.getElementById("categories")
                ?.scrollIntoView({ behavior: "smooth" });
        });
    }


    /* -----------------------------------------------------
       3. CTA "Start Exploring" → scroll to categories
    ----------------------------------------------------- */
    const startExploringButton = document.getElementById("start-exploring");

    if (startExploringButton)
    {
        startExploringButton.addEventListener("click", function ()
        {
            document.getElementById("categories")
                ?.scrollIntoView({ behavior: "smooth" });
        });
    }


    /* -----------------------------------------------------
       4. Search with highlight + auto-clear
    ----------------------------------------------------- */
    const searchInput = document.getElementById("search-input");
    let highlightTimeout;

    if (searchInput)
    {
        searchInput.addEventListener("keydown", function (event)
        {
            if (event.key !== "Enter") return;

            const searchTerm = searchInput.value.toLowerCase().trim();
            if (!searchTerm) return;

            const searchableItems = document.querySelectorAll(
                ".zashara-category-card, .zashara-product-card, .zashara-seller-card"
            );

            let foundItem = null;

            searchableItems.forEach(function (item)
            {
                if (foundItem) return;
                if (item.innerText.toLowerCase().includes(searchTerm))
                {
                    foundItem = item;
                }
            });

            if (foundItem)
            {
                foundItem.scrollIntoView({ behavior: "smooth", block: "center" });

                clearTimeout(highlightTimeout);
                foundItem.classList.add("zashara-highlight");

                highlightTimeout = setTimeout(function ()
                {
                    foundItem.classList.remove("zashara-highlight");
                }, 1600);
            }
            else
            {
                showToast("No results for: \u201C" + searchInput.value + "\u201D");
            }
        });
    }


    /* -----------------------------------------------------
       5. Lightweight toast (replaces alert())
    ----------------------------------------------------- */
    function showToast(message)
    {
        const existing = document.querySelector(".zashara-toast");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.className = "zashara-toast";
        toast.textContent = message;

        Object.assign(toast.style, {
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%) translateY(20px)",
            backgroundColor: "#1a120b",
            color: "#f1e7d0",
            padding: "12px 22px",
            borderRadius: "10px",
            fontSize: "0.95rem",
            fontWeight: "600",
            boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
            opacity: "0",
            zIndex: "2000",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            maxWidth: "90vw",
            textAlign: "center"
        });

        document.body.appendChild(toast);

        requestAnimationFrame(function ()
        {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
        });

        setTimeout(function ()
        {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(20px)";
            setTimeout(function () { toast.remove(); }, 300);
        }, 2400);
    }
});