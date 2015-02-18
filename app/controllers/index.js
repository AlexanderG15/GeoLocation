var geo = require('geolocalizacion');

function geoLocalizar() {
	$.boton.touchEnabled = false;
	$.boton.title = "Localizando...";

	geo.getCurrentLocation(function(_datos) {

		console.log(JSON.stringify(_datos, null, 4));

		// Si hay datos
		if (_datos) {
			//alert("Estoy en: \n" + _datos.title);

			// Instancio el controlador pasándole los datos como parámetros
			var controladorMapa = Alloy.createController("vistaMapa", {
				latitud : _datos.coords.latitude,
				longitud : _datos.coords.longitude,
				titulo : _datos.title
			});
			
			// Obtengo la vista resultante 
			var vistaMapa = controladorMapa.getView();
			
			// Abro la vista
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
