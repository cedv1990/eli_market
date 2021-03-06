/// <reference path="../s5-js/s5.js" />
/// <reference path="../s5-js/s5.icons.js" />
/// <reference path="../index.js" />

market.define('index/login', [], () => {

    const usuario = s5.get('usuario');
    const pass = s5.get('pass');
    const btn = s5.get('.login-container .in').shift();
    const form = s5.extend(pass.parentNode);
    const msj = form.get('.msj').shift();

    const __elements = s5.get('.login-container.container .buttons-container button');
    __elements.push(usuario);
    __elements.push(pass);

    const _disable = (dis) => {
        window['disabled'] = dis;
        __elements.forEach((el) => dis ? el.attribute('disabled', 'disabled') : el.removeAttribute('disabled'));
    };

    const ingreso = () => {
        msj.innerHTML = '';
        if (!form.checkValidity()){
            msj.innerHTML = 'Falta completar campo(s) requerido(s).';
        }
        else{
            _disable(true);
            msj.innerHTML = 'Ingresando...';
            s5.Request('POST', market['services-url'] + '/user', {
                Ok: (d) => {
                    s5.Request('POST', '/init', {
                        Ok: () => {
                            window.location.href = window.location.href;
                        }
                    },
                    {
                        'user': d.data
                    });
                },
                Unauthorized: (data) => {
                    msj.innerHTML = 'Usuario o contraseña incorrectos.';
                    _disable(false);
                },
                InternalServerError: (data) => {
                    msj.innerHTML = 'Ocurrió un error.';
                    console.log(data);
                    _disable(false);
                }
            },
            {
                'user': {
                    'usuario': usuario.value,
                    'pass': pass.value.toAESEncrypt()
                }
            })
        }
    };

    btn.addEvent('click', ingreso);

    btn.addEvent.call(window, 'keyup', (e) => {
        if (e.keyCode == 13 && !window['disabled']) {
            ingreso();
        }
    });

    const _init = () => {
        console.log('Inicia login');
        usuario.value = '';
        pass.value = '';
        msj.innerHTML = '';
    };

    return {
        init: _init
    }
});