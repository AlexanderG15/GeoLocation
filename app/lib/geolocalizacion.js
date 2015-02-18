/* callback function for getCurrentLocation */
// Será llamado cuando se obtenga un resultado 'location'
var locationCallback = null;
var cuentraAtras = null;

/**
 *
 * @param {Object} _lat
 * @param {Object} _lng
 * @param {Object} _callback
 */

// Con la latitud y longitud que se le pasen, esta función
// devolverá un objeto con las coordenadas y el título de la dirección
// geolocalizada inversamente
function reverseGeocoder(_lat, _lng, _callback) {

	var title;

	Ti.Geolocation.purpose = "Demo de Gelolocalización Wmedia";

	// callback method converting lat lng into a location/address
	Ti.Geolocation.reverseGeocoder(_lat, _lng, function(_data) {

		// Éxito
		if (_data.success) {

			Ti.API.debug("reverseGeocoder " + JSON.stringify(_data, null, 2));

			var place = _data.places[0];
			// Sólo el primero

			if (place.city === "") {
				title = place.address;
			} else {
				title = place.street + " " + place.city;
			}

			// Not found
		} else {
			title = "Dirección no encontrada para: " + _lat + ", " + _lng;
		}

		// Invocamos la función callback con el título (reverse GEO)
		_callback(title);
	});
}

/**
 *
 * @param {Object} _location
 */
// Maneja el evento 'location' y las propiedades que devuelve AUTOMÁTICAMENTE del evento (http://docs.appcelerator.com/titanium/3.0/#!/guide/Tracking_Position_and_Heading)
function locationCallbackHandler(_location) {

	// Eliminamos la suscripción al evento 'location', ya no lo necesitamos
	Ti.Geolocation.removeEventListener('location', locationCallbackHandler);

	// http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Geolocation-event-location
	// Nos aseguramos de no hay error y tenemos unas coordenadas listas
	if (!_location.error && _location && _location.coords) {
		
		// Ha funcionado, no queremos una cancelación
		clearTimeout(cuentaAtras);

		var lat,
		    lng;

		Ti.API.debug("locationCallback " + JSON.stringify(_location, null, 2));
		// http://stackoverflow.com/questions/17537571/second-argument-in-json-stringify-in-javascript

		// Caché de latitud y longitud GPS
		lat = _location.coords.latitude;
		lng = _location.coords.longitude;

		// Llama a la función de localización inversa con los datos obtenidos
		reverseGeocoder(lat, lng,

		// Esta función es el callback que me devolverá reverseGeocoder()
		// con el título obtenido de la geolocalización inversa
		function(_title) {

			// La función que establecimos como parámetro en la llamada a getCurrentLocation()
			// con un objeto JSON con las propiedades y el título devuelto por reverseGeocoder()
			locationCallback({
				coords : _location.coords,
				title : _title
			}, null);

			locationCallback = null;
		});

		// Si no hay resultados mostramos el error
	} else {
		alert('Error en los servicios de gelolocalización: ' + _location.error);
		locationCallback(null, _location.error);
	}
}

/**
 *
 * @param {Object} _callback
 */
// Configura y lanza la obtención de la posición GPS,
// se suscribe al evento 'location'
exports.getCurrentLocation = function(_callback) {

	// Si en 10 segundos no tenemos respuesta del GPS, abortamos
	cuentaAtras = setTimeout(function() {
		Ti.App.fireEvent('noGps');
		Ti.Geolocation.removeEventListener('location', locationCallbackHandler);
		return;
	}, 10000);

	// Si no hay servicios geo disponibles
	if (!Ti.Geolocation.getLocationServicesEnabled()) {
		alert('No hay servicios GPS activos.');
		_callback(null, 'No hay servicios GPS activos.');
		// http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/
		return;
	}

	// guardamos el callback del parámetro en la variable global
	// para usarlo en locationCallbackHandler
	locationCallback = _callback;

	// Configuración de la geolocalización
	Ti.Geolocation.purpose = "Demo de Gelolocalización Wmedia";
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
	Ti.Geolocation.distanceFilter = 10;

	// Escuchamos la resupuesta (evento location) con las coordenadas y cuando ocurran llamamos a locationCallbackHandler
	Ti.Geolocation.addEventListener('location', locationCallbackHandler);
};
