/// <reference path="s5-js/s5.js" />
/// <reference path="s5-js/s5.icons.js" />
/// <reference path="s5-js/s5.autocomplete.js" />

const market = s5.initialize();

market.require([], () => {
    const authcontainer = s5.get('.authentication-container').shift();
    const logincontainer = s5.get('.login-container').shift();
    const login = s5.get('login').insert(s5.iconos.Tabular(20, '#FFFFFF'), 0);
    const signin = s5.get('signin').insert(s5.iconos.Perfil(20, '#FFFFFF'), 0);
    const backs = s5.get('.back, .in');

    signin.__container = '.signin-container';
    login.__container = '.login-container';

    const __click = function () {
        s5.get('.container:not({0})'.format(this.__container)).forEach((c) => c.classList.add('hide'));

        s5.get(this.__container).shift().classList.remove('hide');
    };

    login.addEvent('click', __click);
    signin.addEvent('click', __click);

    backs.forEach((btn) =>{
        btn.insert(s5.iconos.Flecha(12, '#FFFFFF'), 0);
        btn.__container = '.authentication-container';
        if (btn.classList.contains('back'))
            btn.addEvent('click', __click);
    });
});