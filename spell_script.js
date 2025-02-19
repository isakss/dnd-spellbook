const spellList = document.getElementById("spell-list");
const apiString = "https://www.dnd5eapi.co/api/spells";

fetch(apiString)
    .then(response => response.json())
    .then(data => {
        data.results.forEach(spell => {
            const listItem = document.createElement("li");
            listItem.textContent = spell.name;
            listItem.addEventListener("click", () => getSpellDetails(spell.url));
            spellList.appendChild(listItem);
        });
    })

function getSpellDetails(url) {
    fetch(`https://www.dnd5eapi.co${url}`)
        .then(response => response.json())
        .then(data => alert(`Spell: ${data.name}\nLevel: ${data.level}\nDescription: ${data.desc.join(' ')}`))
        .catch(error => console.error("Error fetching spell details: ", error));
}