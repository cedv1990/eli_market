/// <reference path="s5-js/s5.js" />
/// <reference path="s5-js/s5.icons.js" />
/// <reference path="s5-js/s5.autocomplete.js" />

const market = s5.initialize();
market['services-url'] = 'https://eli-market-s.herokuapp.com';

market.require([], () => {
    const btnUser = s5.get('.user-button').shift();
    const menuUser = s5.get('.user-menu').shift();
    const logout = s5.get('.exit').shift().insert(s5.iconos.Power(12, '#FFFFFF'), 0);

    btnUser.addEvent('click', () => {
        btnUser.classList.toggle('selected');
        menuUser.classList.toggle('visible');
    });

    logout.addEvent('click', () => {
        window.location.href = '/abandon';
    });
});