const spellCardTemplate = document.querySelector("[data-spell-template]");
const spellCardContainer = document.querySelector("[data-spell-cards-container]");
const spellSearchInput = document.querySelector("[data-search]");

const apiString = "https://www.dnd5eapi.co/api/spells";
const spellCache = {}; // store instance of spell in a dictionary keyed on spell name

let spells = [];

// Search filter function, searches spell list for names containing target value
spellSearchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    
    spells.forEach(spell => {
        const spellName = spell.name.toLowerCase();
        if(spellName.includes(value)) {
            spell.element.classList.remove("hide");      //If the spell name includes value, it is no longer hidden
        } else {
            spell.element.classList.add("hide");         //If the value is not in the name, it is filtered out
        }
    });
});


// Call api and initialize spell card objects
fetch(apiString)
    .then(response => response.json())
    .then(data => {
        spells = data.results.map(spell => {
            const spellCard = spellCardTemplate.content.cloneNode(true);
            const spellCardElement = spellCard.querySelector(".spell-card");

            const spellHeader = spellCard.querySelector("[data-header]");
            const spellBody = spellCard.querySelector("[data-body]");
            
            // Spell body contents
            const spellLevel = spellCardElement.querySelector("[data-level]");
            const spellDetails = spellCardElement.querySelector("[data-details]");
            const spellRange = spellCardElement.querySelector("[data-range]");
            const spellComponents = spellCardElement.querySelector("[data-components]");

            spellHeader.textContent = spell.name;

            // When you click on spell banner, fetches api information, loads into body and presents it in a drop down list
            spellHeader.addEventListener("click", () => {
                if(spellBody.classList.contains("hide")) {
                    if(spellCache[spell.name]) {
                        getSpellDetails(spellCache[spell.name]);
                        spellBody.classList.remove("hide")
                    } else {
                        fetch(`https://www.dnd5eapi.co${spell.url}`)
                            .then(response => response.json())
                            .then(detailData => {
                                spellCache[spell.name] = detailData;
                                getSpellDetails(detailData);
                                spellBody.classList.remove("hide");
                            })
                            .catch(err => {
                                console.error(`Failed to load details for ${spell.name}:`, err);
                            });
                    }
                } else {
                    spellBody.classList.add("hide");
                }
            });
            
            // Maps spell details to their html element
            function getSpellDetails(detailData) {
                spellLevel.textContent = `Level: ${detailData.level}`;
                spellDetails.textContent = detailData.desc.join(" ");
                spellRange.textContent = `Range: ${detailData.range}`;
                spellComponents.textContent = `Components: ${detailData.components.join(", ")}`;
            }
            
            // Adds spell card to spell card container
            spellCardContainer.append(spellCardElement);
            return { name: spell.name, element: spellCardElement };
        });
    });
