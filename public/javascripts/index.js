/// <reference path="s5-js/s5.js" />
/// <reference path="s5-js/s5.icons.js" />
/// <reference path="s5-js/s5.autocomplete.js" />

const market = s5.initialize();
market['services-url'] = 'https://eli-market-s.herokuapp.com';

const login = s5.get('login').insert(s5.iconos.Tabular(20, '#FFFFFF'), 0);
const signin = s5.get('signin').insert(s5.iconos.Perfil(20, '#FFFFFF'), 0);
const backs = s5.get('.back, .in');
backs.forEach((btn) => btn.insert(s5.iconos.Flecha(12, '#FFFFFF'), 0));

market.require(['index/layout'], (layout) => {
    layout.init();
});