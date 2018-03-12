/// <reference path="s5-js/s5.js" />
/// <reference path="s5-js/s5.icons.js" />
/// <reference path="s5-js/s5.autocomplete.js" />

const market = s5.initialize();
market['services-url'] = 'https://eli-market-s.herokuapp.com';

market.require([], () => {
    const supermarketContainer = s5.get('.supermarket-container.container > div').shift();
    const btnUser = s5.get('.user-button').shift();
    const menuUser = s5.get('.user-menu').shift();
    const logout = s5.get('.exit').shift().insert(s5.iconos.Power(12, '#FFFFFF'), 0);
    const photo = s5.get('.photo').shift();
    const photoUser = s5.get('.user-photo').shift();
    const fileInput = s5.get('photo-uploader');
    const addSuperBtn = s5.get('add-super').insert(s5.iconos.Plus(15, '#FFFFFF'), 0);

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

    const showSuperList = () => {
        let elim = s5.get('.super-item');
        while(elim.length > 0)
            elim.shift().delete();

        superMarkets.forEach((s, i) => {

            const text = '{0} ({1})'.format(s.name, s.direction);
            //const text = 'Nombre: {0}, Gps: {1}, Distance: {2}'.format(s.name, JSON.stringify( s.gps ), s.distance);

            const supermarket = s5.createElem('div', { 'class': 'super-item' }).insert(document.createTextNode(text));

            supermarketContainer.insert(supermarket, i + 1);

        });
    }

    const distance = (a, b) => {
        return Math.sqrt( Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) );
    };

    let watcher,
        locationGps;

    const loadSuperNear = () => {
        if (locationGps && superMarkets.length > 0) {
            superMarkets.forEach((s) => {
                s.distance = s.gps ? distance(
                    { x: s.gps.longitude, y: s.gps.latitude },
                    { x: locationGps.longitude, y: locationGps.latitude }
                ) : 1;
            });
            superMarkets = superMarkets.sort((a, b) => a.distance - b.distance);
            showSuperList();
        }
    }

    const geoLocation = (position) => {
        locationGps = {
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        //s5.get('prb').innerHTML += '<hr />Accuracy: {0}<br />Latitude: {1}<br />Longitude: {2}<br />'.format(locationGps.accuracy, locationGps.latitude, locationGps.longitude);
        loadSuperNear();
        if (locationGps.accuracy <= 1000) {
            navigator.geolocation.clearWatch(watcher);
        }
    };

    if ('geolocation' in navigator) {
        watcher = navigator.geolocation.watchPosition(geoLocation, () => {}, {
            enableHighAccuracy: true,
            desiredAccuracy   : 0,
            maximumAge        : 0,
            timeout           : 5000,
            frequency         : 1
        });
    } 
    else {
        showSuperList();
    }

    s5.Request('GET', market['services-url'] + '/super', {
        Ok: (d) => {
            superMarkets = d.data;
            localStorage.setItem('superMarkets', JSON.stringify( d.data ));
            loadSuperNear();
        },
        InternalServerError: () => {
            superMarkets = JSON.parse( localStorage.getItem('superMarkets') );
            showSuperList();
        }
    });
});