const container = document.querySelector(".container");
const template = document.querySelector(".template");
const totalPairs = 6;

let matches = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPairs}&offset=20`)
  .then((res) => res.json())
  .then((data) => {
    const pokemonList = data.results;

    // Obtener detalles de cada Pokémon
    Promise.all(
      pokemonList.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
    ).then((pokemonDataArray) => {
      const cardsData = [...pokemonDataArray, ...pokemonDataArray]; // duplicar

      // Barajar cartas
      shuffleArray(cardsData);

      // Renderizar
      cardsData.forEach((pokemonData) => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".card");

        const backImg = card.querySelector(".back__img");

        backImg.src = pokemonData.sprites.other["dream_world"].front_default;
        backImg.alt = pokemonData.name;

        // Asignar ID para comparar
        card.setAttribute("data-id", pokemonData.id);

        // Evento de clic
        card.addEventListener("click", () => handleCardClick(card));

        container.appendChild(clone);
      });
    });
  })
  .catch((err) => console.log(err));

function handleCardClick(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  const firstId = firstCard.getAttribute("data-id");
  const secondId = secondCard.getAttribute("data-id");

  if (firstId === secondId) {
    // Coincidencia
    matches++;

    firstCard.removeEventListener("click", () => handleCardClick(firstCard));
    secondCard.removeEventListener("click", () => handleCardClick(secondCard));

    resetBoard();

    if (matches === totalPairs) {
      setTimeout(() => {
        document.querySelector(".modal-overlay").classList.remove("hidden");
      }, 500);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.getElementById("restartBtn").addEventListener("click", () => {
  window.location.reload();
});
