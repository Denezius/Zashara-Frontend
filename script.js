const quickNavItems = document.querySelectorAll(".quick-nav-item");

quickNavItems.forEach(function(item)
{
    item.addEventListener("click", function()
    {
        const targetId = item.dataset.target;

        const targetSection = document.getElementById(targetId);

        if (targetSection)
        {
            targetSection.scrollIntoView(
            {
                behavior: "smooth"
            });
        }
    });
});

const exploreNowButton = document.getElementById("explore-now");

exploreNowButton.addEventListener("click", function()
{
    document.getElementById("categories").scrollIntoView(
    {
        behavior: "smooth"
    });
});


const startExploringButton = document.getElementById("start-exploring");

startExploringButton.addEventListener("click", function()
{
    document.getElementById("categories").scrollIntoView(
    {
        behavior: "smooth"
    });
});

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keydown", function(event)
{
    if (event.key === "Enter")
    {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === "")
        {
            return;
        }

        const searchableItems = document.querySelectorAll(
            ".category-card, .product-card, .seller-card"
        );

        let foundItem = null;

        searchableItems.forEach(function(item)
        {
            if (foundItem === null)
            {
                const itemText = item.innerText.toLowerCase();

                if (itemText.includes(searchTerm))
                {
                    foundItem = item;
                }
            }
        });

        if (foundItem)
        {
            foundItem.scrollIntoView(
            {
                behavior: "smooth",
                block: "center"
            });

            foundItem.style.transform = "scale(1.05)";
            foundItem.style.boxShadow = "0 0 25px rgba(166, 107, 15, 0.7)";

            setTimeout(function()
            {
                foundItem.style.transform = "";
                foundItem.style.boxShadow = "";
            }, 1500);
        }

        else
        {
            alert("Sorry, we couldn't find anything matching: " + searchInput.value);
        }
    }
});