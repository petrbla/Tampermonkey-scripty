// ==UserScript==
// @name         ClickUp EN-CZ Translator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Překládá text mezi angličtinou a češtinou na webu ClickUp
// @author       Petr Blaha
// @match        https://app.clickup.com/*
// @updateURL    https://github.com/petrbla/Tampermonkey-scripty/raw/main/clickuplanguage.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Pole obsahující mapování mezi češtinou a angličtinou
    const translations = {
        'Hide': 'Skrýt',
        'Invite': 'Pozvánka',
        'Share': 'Sdílet',
        // Přidejte další překlady podle potřeby
    };

    // Funkce pro překlad textu
    function translateText(text) {
        const translatedText = translations[text] || text;
        return translatedText;
    }

    // Funkce pro procházení DOM a překlad textových uzlů
    function walkAndTranslate(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const translatedText = translateText(node.nodeValue.trim());
            if (translatedText !== node.nodeValue) {
                const newNode = document.createTextNode(translatedText);
                node.parentNode.replaceChild(newNode, node);
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                walkAndTranslate(node.childNodes[i]);
            }
        }
    }

    // Spuštění překladu při načtení stránky
    window.addEventListener('load', function() {
        walkAndTranslate(document.body);
    });

    // Spuštění překladu při změně DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            Array.from(mutation.addedNodes).forEach(function(node) {
                walkAndTranslate(node);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();