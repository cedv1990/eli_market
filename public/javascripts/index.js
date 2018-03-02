/// <reference path="s5-js/s5.js" />
/// <reference path="s5-js/s5.icons.js" />
/// <reference path="s5-js/s5.autocomplete.js" />

const market = s5.initialize();

market.require([], () => {
    s5.get('.login').shift().insert(s5.iconos.Tabular(20, '#FFFFFF'), 0);
    s5.get('.signin').shift().insert(s5.iconos.Perfil(20, '#FFFFFF'), 0);
});