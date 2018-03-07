/// <reference path="../s5-js/s5.js" />
/// <reference path="../s5-js/s5.icons.js" />
/// <reference path="../index.js" />

market.define('index/layout', ['index/login'], (indexLogin) => {

    const _init = () => {
        const authcontainer = s5.get('.authentication-container').shift();
        const logincontainer = s5.get('.login-container').shift();

        signin.__container = '.signin-container';
        login.__container = '.login-container';

        signin.__initFn = ()=>{};
        login.__initFn = indexLogin.init;

        const __click = function () {
            s5.get('.container:not({0})'.format(this.__container)).forEach((c) => c.classList.add('hide'));

            s5.get(this.__container).shift().classList.remove('hide');

            this.__initFn();
        };

        login.addEvent('click', __click);
        signin.addEvent('click', __click);

        backs.forEach((btn) => {
            btn.__container = '.authentication-container';
            if (btn.classList.contains('back'))
                btn.addEvent('click', __click);
        });
    };

    return {
        init: _init
    }
});