const selectedMeals = new Set();

// Event-Listener für alle .grid-Container (Frühstück & Mittag/Abendbrot)
document.querySelectorAll(".grid").forEach(grid => {
  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (!card) return;

    const id = card.dataset.id;
    card.classList.toggle("selected");

    if (selectedMeals.has(id)) {
      selectedMeals.delete(id);
    } else {
      selectedMeals.add(id);
    }
  });
});

// Klick auf den "Generate"-Button
document.getElementById("generate").addEventListener("click", () => {
  const selectedArray = Array.from(selectedMeals);
  localStorage.setItem("selectedMeals", JSON.stringify(selectedArray));
  window.location.href = "generator.html";
});
