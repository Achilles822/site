export const themeStorageKey = "theme"

export const themeInitScript = `(function(){try{var stored=localStorage.getItem(${JSON.stringify(themeStorageKey)});var theme=stored==="dark"||stored==="light"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=theme;}catch(e){}})();`
