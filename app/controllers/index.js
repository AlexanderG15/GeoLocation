var geo = require('geolocalizacion');

function geoLocalizar() {
	$.boton.touchEnabled = false;
	$.boton.title = "Localizando...";

	geo.getCurrentLocation(function(_datos) {

		console.log(JSON.stringify(_datos, null, 4));

		if (_datos) {
			//alert("Estoy en: \n" + _datos.title);

			//Lanzar el mapa con los datos
			var controladorMapa = Alloy.createController("vistaMapa", {
				latitud : _datos.coords.latitude,
				longitud : _datos.coords.longitude,
				titulo : _datos.title
			});

			var vistaMapa = controladorMapa.getView();
			vistaMapa.open();

		} else {
			alert("Sin disponibilidad GPS.");
		}

		$.boton.touchEnabled = true;
		$.boton.title = "¿Dónde estoy?";

	});

}

Ti.App.addEventListener('noGps', function(e) {
	alert("Sin disponibilidad GPS.");
	$.boton.touchEnabled = true;
	$.boton.title = "¿Dónde estoy?";
});

// Abrimos la ventana principal
$.index.open();
