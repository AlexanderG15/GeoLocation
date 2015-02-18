var args = arguments[0] || {};

// Parámetros de geolicalización
var latitud = args.latitud;
var longitud = args.longitud;
var titulo = args.titulo;

// Creamos la anotación
var annotation = Alloy.Globals.Map.createAnnotation({
	latitude : Number(latitud),
	longitude : Number(longitud),
	title : titulo,
});

// Header
$.title.text = titulo;

// Añadimos la anotación al mapa
$.mapview.setAnnotations([annotation]);

// Configuramos la región
$.mapview.setRegion({
	latitude : annotation.latitude,
	longitude : annotation.longitude,
	latitudeDelta : 0.040,
	longitudeDelta : 0.040
});

$.getView().addEventListener("androidback", androidBackEventHandler);

function androidBackEventHandler(_event) {
	_event.cancelBubble = true;
	_event.bubbles = false;
	$.getView().removeEventListener("androidback", androidBackEventHandler);
	$.getView().close();
}

// Configuración del ActionBar
$.getView().addEventListener("open", function() {
	OS_ANDROID && ($.getView().activity.onCreateOptionsMenu = function() {
		var actionBar = $.getView().activity.actionBar;
		if (actionBar) {
			actionBar.displayHomeAsUp = true;
			actionBar.onHomeIconItemSelected = function() {
				$.getView().removeEventListener("androidback", androidBackEventHandler);
				$.getView().close();
			};
		}
	});
}); 