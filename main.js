const pokemonsContainer = document.querySelector("#pokemons");
const typesContainer = document.querySelector("#types");
const leftButton = document.querySelector("#left");
const rightButton = document.querySelector("#right");
const inputName = document.querySelector("#search");
const pokemonDetail = document.querySelector("#pokemon-details");
let numPoke = 10;
let indexPoke = 1;
pokemones(indexPoke, 0, numPoke);

leftButton.addEventListener("click", () => {
  if (numPoke > 10) {
    pokemones(indexPoke, numPoke - 20, numPoke - 10);
    numPoke = numPoke - 10;
  }
});
rightButton.addEventListener("click", () => {
  pokemones(indexPoke, numPoke, numPoke + 10);
  numPoke = numPoke + 10;
});
inputName.addEventListener("input", async () => {
  let response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${inputName.value.toLowerCase()}`
  );
  if (response.status == 200 && inputName.value) {
    modal(response);
  }
});
async function pokemones(indexT, off, limit) {
  try {
    pokemonsContainer.innerHTML = " ";
    let response = await fetch(`https://pokeapi.co/api/v2/type/${indexT}`);
    const pokemons = (await response.json()).pokemon;

    pokemons.slice(off, limit).forEach(async (indexPokemon) => {
      const res = await fetch(indexPokemon.pokemon.url);
      const pokeInfo = await res.json();
      const abilities = pokeInfo.abilities.map((abilitie) => {
        return abilitie.ability.name;
      });
      const pokemonContain = document.createElement("div");
      pokemonContain.classList.add("pokemon-container");
      pokemonContain.addEventListener("click", async () => {
        let response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokeInfo.name.toLowerCase()}`
        );
        modal(response);
      });
      pokemonsContainer.appendChild(pokemonContain);
      pokemonContain.innerHTML += `
                <img
                    class="pokemon-img"
                    src="${pokeInfo.sprites.other.dream_world.front_default}"
                    alt=""
                />
                <div class="pokemon-info">
                    <h2>${firstMayus(pokeInfo.name)}</h2>
                    <p>Weight: ${pokeInfo.height} lb</p>
                    <div class="pokemon-abilities">
                        ${abilities
                          .map((abilitie) => {
                            return `<div class="abilitie">${firstMayus(
                              abilitie
                            )}</div>`;
                          })
                          .join("")}
                    </div>

                </div>

        `;
    });
  } catch (error) {
    console.error("Error fetching types:", error);
  }
}
(async function types() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const types = (await response.json()).results;
    types.forEach(async (type, typeIndex) => {
      const response = await fetch(type.url);
      const typeInfo = await response.json();
      const button = document.createElement("button");
      button.classList.add("type-button");
      if (typeInfo.sprites["generation-iii"]["colosseum"].name_icon) {
        const img = document.createElement("img");
        img.src = typeInfo.sprites["generation-iii"]["colosseum"].name_icon;
        button.appendChild(img);
      } else {
        button.textContent = typeInfo.name.toUpperCase();
        button.style =
          "background-color: #88579e; padding:.5rem; border-radius:1rem; color:white;  font-weight: 600";
      }
      button.addEventListener("click", () => {
        const index = typeIndex + 1;
        indexPoke = index;
        numPoke = 10;
        pokemones(index, 0, 10);
      });
      typesContainer.appendChild(button);
    });
  } catch (error) {
    console.error("Error fetching types:", error);
  }
})();

function firstMayus(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
async function modal(response) {
  pokemonsContainer.innerHTML = " ";
  pokemonDetail.innerHTML = "";

  const pokemon = await response.json();
  pokemonDetail.classList.add("opacity");
  const abilities = pokemon.abilities.map((abilitie) => {
    return abilitie.ability.name;
  });
  inputName.blur();

  pokemonDetail.innerHTML += `<div class="one-pokemon-container">
                    <button class="back-button">🔙</button>
                    <img
                        class="pokemon-img"
                        src="${pokemon.sprites.other.dream_world.front_default}"
                        alt=""
                    />
                    <div class="pokemon-info">
                        <h2>${firstMayus(pokemon.name)}</h2>
                        <p>Weight: ${pokemon.height} lb</p>
                        <div class="pokemon-abilities">
                            ${abilities
                              .map((abilitie) => {
                                return `<div class="abilitie">${firstMayus(
                                  abilitie
                                )}</div>`;
                              })
                              .join("")}
                        </div>
                    </div>
    
            </div>
            `;
  const backButton = document.querySelector(".back-button");
  backButton.addEventListener("click", () => {
    pokemonDetail.innerHTML = "";
    pokemonDetail.classList.remove("opacity");
    pokemones(indexPoke, numPoke-10, numPoke);
  });
}
