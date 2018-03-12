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
    const photoUser = s5.get('.user-photo').shift();
    const fileInput = s5.get('photo-uploader');
    let superMarkets = [];

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
                        photo.styles('background-image', 'url("{0}")'.format(data));
                        photoUser.styles('background-image', 'url("{0}")'.format(data));
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

    const geoLocation = (position) => {
        const loc = {
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        s5.get('prb').innerHTML += '<hr />Accuracy: {0}<br />Latitude: {1}<br />Longitude: {2}<br />'.format(loc.accuracy, loc.latitude, loc.longitude);
    };

    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(geoLocation, () => {}, {
            enableHighAccuracy: true,
            desiredAccuracy   : 0,
            maximumAge        : 0,
            timeout           : 5000,
            frequency         : 1
        });
    } 
    else {
        /* la geolocalización NO está disponible */
    }

    s5.Request('GET', market['services-url'] + '/super', {
        Ok: (d) => {
            superMarkets = d.data;
            localStorage.setItem('superMarkets', JSON.stringify( d.data ));
        },
        InternalServerError: () => {
            superMarkets = JSON.parse( localStorage.getItem('superMarkets') );
        }
    });
});