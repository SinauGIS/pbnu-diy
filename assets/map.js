/* Initial Map */
var map = L.map('map').setView([-7.7905952, 110.3756905], 13); //lat, long, zoom

// disable attribution
map.attributionControl.setPrefix(false);

/* Tile Basemap */
var street = L.tileLayer('https://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}', {
	maxZoom: 20,
	minZoom: 0,
	attribution: 'Google Street',
	label: 'Google Street'
});

var satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
	maxZoom: 20,
	minZoom: 0,
	subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
	attribution: 'Google Satellite',
	label: 'Google Satellite'
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 20,
	minZoom: 0,
	attribution: 'OpenStreetMap',
	label: 'OSM'
});

// Control Layer Basemaps
map.addControl(L.control.basemaps({
	basemaps: [osm, street, satellite],
	tileX: 0, // tile X coordinate
	tileY: 0, // tile Y coordinate
	tileZ: 1 // tile zoom level
}));

/* GeoJSON Point */
var pointobj = L.geoJson(null, {
	onEachFeature: function (feature, layer) {
		if (feature.properties) {
			var content = "<strong class='mb-3'>" + feature.properties.nama + "</strong>" +
				"<table class='table table-striped table-bordered'>" +
				"<tr><td>Jenis Fasilitas</td><td>" + feature.properties.jenis_fasilitas + "</td></tr>" +
				"<tr><td>Deskripsi</td><td>" + feature.properties.deskripsi + "</td></tr>" +
				"<tr><td>Jumlah Guru Laki-laki</td><td>" + feature.properties.guru_laki + "</td></tr>" +
				"<tr><td>Jumlah Guru Perempuan</td><td>" + feature.properties.guru_perempuan + "</td></tr>" +
				"<tr><td>Jumlah Santri Laki-laki</td><td>" + feature.properties.santri_laki + "</td></tr>" +
				"<tr><td>Jumlah Santri Perempuan</td><td>" + feature.properties.santri_perempuan + "</td></tr>" +
				"</table>"
			"<small>" + feature.properties.timestamp + "</small>";
			layer.on({
				click: function (e) {
					pointobj.bindPopup(content);
				},
				mouseover: function (e) {
					pointobj.bindTooltip(feature.properties.nama);
				}
			});
		}
	}
});
$.getJSON("https://script.google.com/macros/s/AKfycbw7i8CnaNnAGnSPKJeOB6s_Oz5X-BRnLi1vGJyappVg1jtJWx7suW3Jn3G5WbpvGFsN/exec", function (data) {
	pointobj.addData(data);
	map.addLayer(pointobj);
	map.fitBounds(pointobj.getBounds());
});

// Peta Bahaya
let layer_bahaya_banjir = L.esri.imageMapLayer({
	url: "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_banjir/ImageServer",
	opacity: 0.75,
	attribution: "Bahaya Banjir"
});

let layer_bahaya_cuaca_ekstrim = L.esri.imageMapLayer({
	url: "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_cuaca_ekstrim/ImageServer",
	opacity: 0.75,
	attribution: "Bahaya Cuaca Ekstrim"
});

let layer_bahaya_gempabumi = L.esri.imageMapLayer({
	url: "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_gempabumi/ImageServer",
	opacity: 0.75,
	attribution: "Bahaya Gempabumi"
});

let layer_bahaya_kebakaran_hutan_dan_lahan = L.esri.imageMapLayer({
	url: "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_kebakaran_hutan_dan_lahan/ImageServer",
	opacity: 0.75,
	attribution: "Bahaya Banjir"
});

let layer_bahaya_kekeringan = L.esri.imageMapLayer({
	url: "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_kekeringan/ImageServer",
	opacity: 0.75,
	attribution: "Bahaya Banjir"
});

let layer_bahaya_letusan_gunungapi = L.esri.imageMapLayer({
	url: "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_letusan_gunungapi/ImageServer",
	opacity: 0.75,
	attribution: "Bahaya Letusan Gunungapi"
});

let layer_bahaya_tanah_longsor = L.esri.imageMapLayer({
	url: "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_tanah_longsor/ImageServer",
	opacity: 0.75,
	attribution: "Bahaya Tanah Longsor"
});

let layer_bahaya_multi = L.esri.imageMapLayer({
	url: "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_multi/ImageServer",
	opacity: 0.75,
	attribution: "Bahaya Multi"
});

var overlayMaps = {
	"Bahaya Banjir": layer_bahaya_banjir,
	"Bahaya Cuaca Ekstrim": layer_bahaya_cuaca_ekstrim,
	"Bahaya Gempabumi": layer_bahaya_gempabumi,
	"Bahaya Kebakaran Hutan dan Lahan": layer_bahaya_kebakaran_hutan_dan_lahan,
	"Bahaya Kekeringan": layer_bahaya_kekeringan,
	"Bahaya Letusan Gunungapi": layer_bahaya_letusan_gunungapi,
	"Bahaya Tanah Longsor": layer_bahaya_tanah_longsor,
	"Bahaya Multi": layer_bahaya_multi
};

var layerControl = L.control.layers(null, overlayMaps, {collapsed: false }).addTo(map);

// Control legend
var legend = L.control({
	position: 'bottomleft'
});

legend.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'legend');
	this.update();
	return this._div;
};

legend.update = function() {
	this._div.innerHTML = `<strong>Indeks Bahaya</strong><br><img src="../assets/images/indeks_bahaya_kerentanan_risiko.png" alt="indeks bahaya" width="150" height="15" class="mt-2"><br><small>Rendah&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tinggi</small>`;
};

legend.addTo(map);