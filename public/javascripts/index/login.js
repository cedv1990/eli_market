/// <reference path="../s5-js/s5.js" />
/// <reference path="../s5-js/s5.icons.js" />
/// <reference path="../index.js" />

market.define('index/login', [], () => {

    const usuario = s5.get('usuario');
    const pass = s5.get('pass');
    const btn = s5.get('.login-container .in').shift();
    const form = s5.extend(pass.parentNode);
    const msj = form.get('.msj').shift();

    btn.addEvent('click', () => {
        msj.innerHTML = '';
        if (!form.checkValidity()){
            msj.innerHTML = 'Falta completar campo(s) requerido(s).';
        }
        else{
            s5.Request('POST', market['services-url'] + '/user', {
                Ok: (d) => {
                    window.location.href = 'init?user=' + JSON.stringify(d.data);
                },
                Unauthorized: (data) => {
                    msj.innerHTML = 'Usuario o contraseña incorrectos.';
                },
                InternalServerError: (data) => {
                    msj.innerHTML = 'Ocurrió un error.';
                    console.log(data);
                }
            },
            {
                'user': {
                    'usuario': usuario.value,
                    'pass': pass.value.toAESEncrypt()
                }
            })
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