const pokemonsContainer = document.querySelector("#pokemons");
const typesContainer = document.querySelector("#types");
const leftButton = document.querySelector("#left");
const rightButton = document.querySelector("#right");
const inputName = document.querySelector("#search");
let numPoke = 10;
pokemones(1, 0, numPoke);

leftButton.addEventListener("click", () => {
  if (numPoke > 10) {
    pokemones(1, numPoke-20, numPoke-10);
    numPoke = numPoke - 10;
  }
});
rightButton.addEventListener("click", () => {
  pokemones(1, numPoke, numPoke + 10);
  numPoke = numPoke + 10;
});
inputName.addEventListener("input", () => {
  console.log(inputName.value);
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

      pokemonsContainer.innerHTML += `<div class="pokemon-container">
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

        </div>`;
    });
  } catch (error) {
    console.error("Error fetching types:", error);
  }
}
(async function types() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const types = (await response.json()).results;
    types.forEach((type, typeIndex) => {
      const button = document.createElement("button");
      button.classList.add("type-button");
      button.textContent = firstMayus(type.name);
      button.addEventListener("click", () => {
        const index = typeIndex + 1;

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
