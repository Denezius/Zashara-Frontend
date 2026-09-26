/* =========================================================
   ZASHARA SELLER — Onboarding interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", function ()
{
    /* -----------------------------------------------------
       1. Smooth scroll for header nav + footer links
          (works for any <a href="#...">)
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

            /* Auto-close the offcanvas if the link is inside it */
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
       2. Onboarding checklist — simulated step completion
          Clicking "Verify Now" advances the checklist and
          the progress bar, and unlocks the next step.
    ----------------------------------------------------- */
    const checklistItems = document.querySelectorAll(".zashara-checklist-item");
    const progressBar    = document.querySelector(".zashara-progress-bar");
    const progressValue  = document.querySelector(".zashara-progress-value");
    const stepCounter    = document.querySelector(".zashara-step-counter");

    function updateProgress()
    {
        const total     = checklistItems.length;
        const completed = document.querySelectorAll(".zashara-checklist-item.completed").length;
        const percent   = Math.round((completed / total) * 100);

        if (progressBar)
        {
            progressBar.style.width = percent + "%";
            progressBar.setAttribute("aria-valuenow", percent);
        }

        if (progressValue) progressValue.textContent = percent + "%";
        if (stepCounter)   stepCounter.textContent   = completed + " of " + total + " complete";
    }

    /* Handle "Verify Now" (or any active-step action button) */
    const activeActionButtons = document.querySelectorAll(
        ".zashara-checklist-item.active .zashara-btn-primary"
    );

    activeActionButtons.forEach(function (button)
    {
        button.addEventListener("click", function ()
        {
            const currentItem = button.closest(".zashara-checklist-item");
            if (!currentItem) return;

            /* Mark current step complete */
            currentItem.classList.remove("active");
            currentItem.classList.add("completed");

            /* Swap the button for a "Done" badge */
            button.replaceWith(createDoneBadge());

            /* Swap the icon to a checkmark */
            const check = currentItem.querySelector(".zashara-checklist-check");
            if (check) check.innerHTML = '<i class="bi bi-check-lg"></i>';

            /* Unlock and activate the next locked step */
            const nextLocked = document.querySelector(".zashara-checklist-item.locked");
            if (nextLocked)
            {
                nextLocked.classList.remove("locked");
                nextLocked.classList.add("active");

                /* Swap its number icon if it's a generic one, ensure a CTA exists */
                const checkEl = nextLocked.querySelector(".zashara-checklist-check");
                if (checkEl) checkEl.innerHTML = '<i class="bi bi-arrow-right-circle-fill"></i>';

                /* Replace the lock icon with a CTA button */
                const lock = nextLocked.querySelector(".zashara-checklist-lock");
                if (lock)
                {
                    const cta = document.createElement("button");
                    cta.className = "btn zashara-btn-primary btn-sm";
                    cta.textContent = "Continue";
                    lock.replaceWith(cta);

                    /* Let this newly-revealed CTA behave the same way */
                    cta.addEventListener("click", function ()
                    {
                        advanceStep(nextLocked, cta);
                    });
                }
            }

            updateProgress();
            showToast("Step completed — nice work!");
        });
    });

    /* Shared advance routine for newly-revealed CTAs */
    function advanceStep(item, button)
    {
        item.classList.remove("active");
        item.classList.add("completed");

        button.replaceWith(createDoneBadge());

        const check = item.querySelector(".zashara-checklist-check");
        if (check) check.innerHTML = '<i class="bi bi-check-lg"></i>';

        const nextLocked = document.querySelector(".zashara-checklist-item.locked");
        if (nextLocked)
        {
            nextLocked.classList.remove("locked");
            nextLocked.classList.add("active");

            const checkEl = nextLocked.querySelector(".zashara-checklist-check");
            if (checkEl) checkEl.innerHTML = '<i class="bi bi-arrow-right-circle-fill"></i>';

            const lock = nextLocked.querySelector(".zashara-checklist-lock");
            if (lock)
            {
                const cta = document.createElement("button");
                cta.className = "btn zashara-btn-primary btn-sm";
                cta.textContent = "Continue";
                lock.replaceWith(cta);

                cta.addEventListener("click", function ()
                {
                    advanceStep(nextLocked, cta);
                });
            }
        }

        updateProgress();
        showToast("Step completed — nice work!");
    }

    function createDoneBadge()
    {
        const badge = document.createElement("span");
        badge.className = "zashara-checklist-badge done";
        badge.textContent = "Done";
        return badge;
    }


    /* -----------------------------------------------------
       3. Final CTA — scroll up to the checklist
    ----------------------------------------------------- */
    const continueButton = document.getElementById("continue-setup");

    if (continueButton)
    {
        continueButton.addEventListener("click", function ()
        {
            document.getElementById("setup")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }


    /* -----------------------------------------------------
       4. Toast
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

    /* Initial progress render */
    updateProgress();
});