export function generateJS() {
  return `document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".mobile-menu-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      var navbar = button.closest(".site-navbar");
      if (navbar) navbar.classList.toggle("nav-open");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      var navbar = anchor.closest(".site-navbar");
      if (navbar) navbar.classList.remove("nav-open");
    });
  });

  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var existing = form.querySelector(".form-success-message");
      if (existing) existing.remove();
      var message = document.createElement("p");
      message.className = "form-success-message";
      message.textContent = "Thanks. Your message was received.";
      message.style.margin = "0";
      message.style.fontWeight = "700";
      message.style.color = "#16a34a";
      form.appendChild(message);
    });
  });
});`;
}
