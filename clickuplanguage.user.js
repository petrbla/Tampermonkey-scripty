// ==UserScript==
// @name         ClickUp EN-CZ Translator - GitHub Translations
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @license      MIT
// @description  Aplikuje překlady z externího zdroje na GitHubu.
// @author       You
// @match        https://app.clickup.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491650/ClickUp%20EN-CZ%20Translator%20-%20GitHub%20Translations.user.js
// @updateURL https://update.greasyfork.org/scripts/491650/ClickUp%20EN-CZ%20Translator%20-%20GitHub%20Translations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inicializace prázdného objektu pro překlady
    let translations = {};

    // Funkce pro načtení překladů z GitHubu
    function loadTranslations() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/petrbla/Tampermonkey-scripty/main/translationsclickupcz.json",
        onload: function(response) {
            console.log("Odpověď načtena", response.responseText);
            translations = JSON.parse(response.responseText);
            console.log("Načtené překlady:", translations);
            applyTranslations(document.body);
        },
        onerror: function(error) {
            console.log("Chyba při načítání překladů", error);
        },
        onreadystatechange: function(response) {
            if (response.readyState === 4 && response.status !== 200) {
                console.log("Chyba - stav: ", response.status);
            }
        }
    }); // Zde chyběla uzavírací závorka
}

    function applyTranslations(element) {
    if (!element || !element.querySelectorAll) return;
    
    // Zahrnutí elementů s atributem placeholder do vyhledávání
    const nodes = element.querySelectorAll('*');
    nodes.forEach(node => {
        // Překlad textových uzlů
        if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
            const text = node.childNodes[0].nodeValue.trim();
            const translatedText = translations[text];
            if (translatedText) {
                node.childNodes[0].nodeValue = translatedText;
            }
        }
        // Překlad placeholderů
        if (node.placeholder) {
            const placeholderText = node.placeholder.trim();
            const translatedPlaceholder = translations[placeholderText];
            if (translatedPlaceholder) {
                node.placeholder = translatedPlaceholder;
            }
        }
    });
}

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((newNode) => {
                    applyTranslations(newNode);
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Spustí načtení překladů a aplikaci při načtení stránky
    window.addEventListener('load', loadTranslations);
})();
