let container = document.getElementById("gallery");
const template = document.querySelector(".template");

fetch("https://pokeapi.co/api/v2/pokemon?limit=21&offset=24")
    .then(resp => resp.json())
    .then(data => {
        data.results.forEach(pokemon => {
            fetch(pokemon.url)
                .then(resp => resp.json())
                .then(pokemonData => {
                    const clone = template.content.cloneNode(true);
                    clone.querySelector(".front img").setAttribute("src", `${pokemonData.sprites.front_default}`);
                    clone.querySelector(".front img").setAttribute("alt", `${pokemon.name}`);
                    clone.querySelector(".back__img").setAttribute("src", `${pokemonData.sprites.back_default}`);
                    clone.querySelector(".back__img").setAttribute("alt", `${pokemon.name}`);
                    clone.querySelector("h3").textContent = pokemon.name;
                    clone.querySelector(".back__text").textContent = `ID: ${pokemonData.id}`;

                    container.querySelector(".container").appendChild(clone);
                });
        });
    })
    .catch(err => console.log(err));
