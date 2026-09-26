/* =========================================================
   ZASHARA SELLER DASHBOARD — Newly-Live Seller interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", function ()
{
    /* -----------------------------------------------------
       1. Smooth scroll for all in-page anchor links
          (and auto-close offcanvas if the link lives inside it)
    ----------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link)
    {
        link.addEventListener("click", function (event)
        {
            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            const offcanvasEl = link.closest(".offcanvas");
            if (offcanvasEl)
            {
                const instance =
                    bootstrap.Offcanvas.getInstance(offcanvasEl) ||
                    new bootstrap.Offcanvas(offcanvasEl);
                instance.hide();
            }
        });
    });


    /* -----------------------------------------------------
       2. "Mark as Shipped" — realistic status update
    ----------------------------------------------------- */
    const shipButtons = document.querySelectorAll(
        ".zashara-order-card .zashara-btn-primary"
    );

    shipButtons.forEach(function (button)
    {
        button.addEventListener("click", function ()
        {
            const card = button.closest(".zashara-order-card");
            const statusPill = card?.querySelector(".zashara-status-pill");

            if (!card || !statusPill) return;

            button.disabled = true;
            button.innerHTML = '<i class="bi bi-check2-circle"></i> Shipped';

            statusPill.classList.remove("pending", "processing");
            statusPill.style.backgroundColor = "rgba(47, 143, 78, 0.15)";
            statusPill.style.color = "#2f8f4e";
            statusPill.textContent = "Shipped";

            showToast("Order marked as shipped. The buyer has been notified.");
        });
    });


    /* -----------------------------------------------------
       3. Next-steps checklist — clickable CTA actions
          These are "soft" actions that just acknowledge intent
          (in a real app they'd route to the relevant flow).
    ----------------------------------------------------- */
    const checklistActions = document.querySelectorAll(
        ".zashara-checklist-item .zashara-btn-primary, .zashara-checklist-item .zashara-btn-outline"
    );

    checklistActions.forEach(function (button)
    {
        button.addEventListener("click", function ()
        {
            const item = button.closest(".zashara-checklist-item");
            if (!item) return;

            /* Scroll the user to a relevant section instead of
               pretending we can complete the action here */
            const label = button.textContent.trim().toLowerCase();

            if (label.includes("add product"))
            {
                document.getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            else if (label.includes("copy link"))
            {
                copyShareLink();
            }
            else if (label.includes("view inbox"))
            {
                document.getElementById("messages")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });


    /* -----------------------------------------------------
       4. Share link — copy to clipboard
    ----------------------------------------------------- */
    const copyButton = document.getElementById("copy-link");
    const shareUrlEl = document.getElementById("share-url");

    function copyShareLink()
    {
        const url = shareUrlEl?.textContent?.trim() || "";
        if (!url) return;

        if (navigator.clipboard && navigator.clipboard.writeText)
        {
            navigator.clipboard.writeText(url).then(function ()
            {
                flashCopyButton(copyButton);
                showToast("Storefront link copied");
            }).catch(function ()
            {
                fallbackCopy(url);
            });
        }
        else
        {
            fallbackCopy(url);
        }
    }

    function fallbackCopy(text)
    {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();

        try
        {
            document.execCommand("copy");
            flashCopyButton(copyButton);
            showToast("Storefront link copied");
        }
        catch (err)
        {
            showToast("Couldn't copy — please copy manually");
        }

        document.body.removeChild(temp);
    }

    function flashCopyButton(button)
    {
        if (!button) return;

        const original = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check2 me-1"></i> Copied';
        button.disabled = true;

        setTimeout(function ()
        {
            button.innerHTML = original;
            button.disabled = false;
        }, 1800);
    }

    if (copyButton)
    {
        copyButton.addEventListener("click", copyShareLink);
    }


    /* -----------------------------------------------------
       5. Share option buttons — simulated share intents
    ----------------------------------------------------- */
    const shareOptions = document.querySelectorAll(".zashara-share-option");

    shareOptions.forEach(function (option)
    {
        option.addEventListener("click", function ()
        {
            const channel = option.textContent.trim();
            showToast("Sharing to " + channel + " — coming soon");
        });
    });


    /* -----------------------------------------------------
       6. "Notify me" — empty-state message opt-in
    ----------------------------------------------------- */
    const notifyButton = document.querySelector(
        ".zashara-empty-state .zashara-btn-outline"
    );

    if (notifyButton)
    {
        notifyButton.addEventListener("click", function ()
        {
            notifyButton.disabled = true;
            notifyButton.innerHTML =
                '<i class="bi bi-check2 me-1"></i> You\'ll be notified';
            showToast("We'll let you know when a message arrives");
        });
    }


    /* -----------------------------------------------------
       7. Toast helper
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