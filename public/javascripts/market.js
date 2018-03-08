/// <reference path="s5-js/s5.js" />
/// <reference path="s5-js/s5.icons.js" />
/// <reference path="s5-js/s5.autocomplete.js" />

const market = s5.initialize();
market['services-url'] = 'https://eli-market-s.herokuapp.com';

market.require([], () => {
    const btnUser = s5.get('.user-button').shift();
    const menuUser = s5.get('.user-menu').shift();
    const logout = s5.get('.exit').shift().insert(s5.iconos.Power(12, '#FFFFFF'), 0);
    const photo = s5.get('.photo').shift();
    const fileInput = s5.get('photo-uploader');

    btnUser.addEvent('click', () => {
        btnUser.classList.toggle('selected');
        menuUser.classList.toggle('visible');
    });

    logout.addEvent('click', () => {
        window.location.href = '/abandon';
    });

    photo.addEvent('click', () => fileInput.click());

    fileInput.addEvent('change', () => {
        if (fileInput.files.length > 0){
            s5.fileToBase64(fileInput.files[0], (f) => {
                let formato = f.name.split('.').pop().toLowerCase();
                if (formato == 'jpg') formato = 'jpeg';

                const data = 'data:image/{0};base64,{1}'.format(formato, f.src);
                s5.Request('PATCH', market['services-url'] + '/user', {
                    Ok: (d) => {
                        debugger;
                    }
                },
                {
                    'user': {
                        'photo': data,
                        'cod': parseInt( fileInput.attribute('data-cod') )
                    }
                })
            });
        }
    });
});