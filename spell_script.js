const spellCardTemplate = document.querySelector("[data-spell-template]");
const spellCardContainer = document.querySelector("[data-spell-cards-container]");
const spellSearchInput = document.querySelector("[data-search]");

const apiString = "https://www.dnd5eapi.co/api/spells";

let spells = []

spellSearchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    
    spells.forEach(spell => {
        const spellName = spell.name.toLowerCase()
        if(spellName.includes(value)) {
            spell.element.classList.remove("hide")
        } else {
            spell.element.classList.add("hide")
        }
    })
})

fetch(apiString)
    .then(response => response.json())
    .then(data => {
        spells = data.results.map(spell => {
            const spellCard = spellCardTemplate.content.cloneNode(true)
            const spellCardElement = spellCard.querySelector(".spell-card")
            const spellHeader = spellCard.querySelector("[data-header]")
            //const spellBody = spellCard.querySelector("[spell-body]")
            spellHeader.textContent = spell.name
            //spellBody.textContent = spell.description
            // TODO: populate body with spell details
            spellCardContainer.append(spellCardElement)
            return { name: spell.name, element: spellCardElement }
        })
    })


function getSpellDetails(url) {
    fetch(`https://www.dnd5eapi.co${url}`)
        .then(response => response.json())
        .then(data => alert(`Spell: ${data.name}\nLevel: ${data.level}\nDescription: ${data.desc.join(' ')}`))
        .catch(error => console.error("Error fetching spell details: ", error));
}
