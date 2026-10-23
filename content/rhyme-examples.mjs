// Editorial examples checked against the public dictionaries, not the app engine.
// Keep these readable without JavaScript; tests check every claimed sound match.
export const rhymeExamples = {
  es: {
    heading: 'Ejemplos de rimas en español',
    intro: 'Una palabra puede tener muchas rimas, pero no todas sirven para tu frase. Estos ejemplos muestran coincidencias consonantes del diccionario. Léelos en voz alta y después busca más opciones.',
    action: 'Buscar más rimas con',
    examples: [
      {word: 'amor', matches: ['dolor'], sentence: 'Escribí sobre el amor; al cantarlo, apareció el dolor.'},
      {word: 'canción', matches: ['corazón'], sentence: 'Guardé tu nombre en una canción y cambié el final con el corazón.'},
      {word: 'camino', matches: ['destino'], sentence: 'No conocía el camino; tampoco tenía escrito el destino.'},
      {word: 'vida', matches: ['herida'], sentence: 'La imagen cambia si hablas de una vida o de una herida.'},
      {word: 'luna', matches: ['cuna'], sentence: 'La luna iluminaba la cuna.'},
      {word: 'alegría', matches: ['poesía'], sentence: 'Convertí aquella alegría en el comienzo de una poesía.'},
    ],
    help: `<h2>Cómo buscar rimas consonantes y asonantes</h2><ol class="prose-list"><li>Escribe una palabra con su tilde: <em>canción</em>, por ejemplo.</li><li>Elige <strong>Rima consonante</strong> para comparar vocales y consonantes desde la vocal tónica, o <strong>Rima asonante</strong> para comparar las vocales desde ese punto.</li><li>Pulsa <strong>Buscar rimas</strong>. Escoge por significado y comprueba el sonido al leer tu verso.</li></ol><p><strong>Casa / masa</strong> es una rima consonante. <strong>Casa / cama</strong> comparte las vocales <em>a–a</em>: es asonante, pero no consonante. <strong>Camino / caminó</strong> cambia la sílaba tónica; no es la misma rima.</p><h2>¿Puedo usar el diccionario gratis y sin registrarme?</h2><p>Sí. La búsqueda funciona en el navegador y no necesita una cuenta ni instalar Cadence. La primera búsqueda descarga el diccionario. Si una palabra no aparece, comprueba la tilde y la escritura; no se inventan resultados.</p><p>Para guardar el verso junto a una instrumental y grabar tu interpretación, consulta <a href="/cadence/es/">Cadence para escribir canciones en español</a>. Para saber cómo se añaden los idiomas a la app, consulta la <a href="/cadence/guide/#languages" lang="en">guía de idiomas en inglés</a>.</p>`,
  },
  fr: {
    heading: 'Exemples de rimes en français',
    intro: 'Ces exemples partagent une terminaison sonore dans le dictionnaire. Une rime doit aussi convenir au sens de votre phrase : lisez-la à voix haute avant de la garder.',
    action: 'Chercher des rimes avec',
    examples: [
      {word: 'amour', matches: ['jour'], sentence: 'Je laisse une place à l’amour au milieu du jour.'},
      {word: 'lumière', matches: ['poussière'], sentence: 'Un rayon de lumière traverse la poussière.'},
      {word: 'cœur', matches: ['sœur'], sentence: 'Je garde dans mon cœur les paroles de ma sœur.'},
      {word: 'peur', matches: ['fleur'], sentence: 'Pour raconter la peur, je dessine une fleur.'},
    ],
    help: `<h2>Comment trouver une rime ?</h2><ol class="prose-list"><li>Saisissez un mot avec ses accents, par exemple <em>lumière</em>.</li><li>Choisissez <strong>Même terminaison sonore</strong> ou <strong>Assonance</strong>.</li><li>Lancez la recherche, puis prononcez les propositions dans votre phrase.</li></ol><p><strong>Amour / jour</strong> partagent /uʁ/. <strong>Amour / doux</strong> partagent la voyelle /u/ en assonance, mais pas la même terminaison complète. <strong>Père / peur</strong> ont des voyelles différentes : une orthographe proche ne suffit pas.</p><h2>Le dictionnaire est-il gratuit et sans inscription ?</h2><p>Oui. Vous pouvez chercher dans le navigateur sans compte et sans installer Cadence. La première recherche télécharge les données. Si un mot manque, vérifiez son orthographe ; aucun résultat anglais ne remplace votre recherche.</p><p>Pour garder vos paroles avec une instrumentale et vos prises vocales, découvrez <a href="/cadence/fr/">Cadence pour écrire des chansons en français</a>. Les étapes de configuration sont dans le <a href="/cadence/guide/#languages" lang="en">guide des langues en anglais</a>.</p>`,
  },
};
