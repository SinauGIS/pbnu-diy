/* Initial Map */
var map = L.map('map').setView([-7.8353231,110.3995514], 12); //lat, long, zoom

// disable attribution
map.attributionControl.setPrefix(false);

// Awesome Markers
var pesantrenMarker = L.AwesomeMarkers.icon({
	icon: 'school',
	stylePrefix: 'fa-solid',
	prefix: 'fa',
	markerColor: 'blue'
});

var ambulansMarker = L.AwesomeMarkers.icon({
	icon: 'truck-medical',
	stylePrefix: 'fa-solid',
	prefix: 'fa',
	markerColor: 'red'
});

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

/* Pesantren */
var pesantren = L.geoJson(null, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {
			icon: pesantrenMarker
		});
	},
	onEachFeature: function (feature, layer) {
		if (feature.properties) {
			var content = "<strong class='mb-3'>" + feature.properties.nama + "</strong>" +
				"<table class='table table-striped table-bordered'>" +
				"<tr><td>Jenis</td><td>" + feature.properties.jenis + "</td></tr>" +
				"<tr><td>Deskripsi</td><td>" + feature.properties.deskripsi + "</td></tr>" +
				"<tr><td>Jumlah Guru Laki-laki</td><td>" + feature.properties.guru_laki + "</td></tr>" +
				"<tr><td>Jumlah Guru Perempuan</td><td>" + feature.properties.guru_perempuan + "</td></tr>" +
				"<tr><td>Jumlah Santri Laki-laki</td><td>" + feature.properties.santri_laki + "</td></tr>" +
				"<tr><td>Jumlah Santri Perempuan</td><td>" + feature.properties.santri_perempuan + "</td></tr>" +
				"</table>"
			"<small>" + feature.properties.timestamp + "</small>";
			layer.on({
				click: function (e) {
					pesantren.bindPopup(content);
				},
				mouseover: function (e) {
					pesantren.bindTooltip(feature.properties.nama);
				}
			});
		}
	}
});
$.getJSON("https://script.google.com/macros/s/AKfycbwOMrC5nXLvJxbB3KHy1AWaUzBBOP5F91j3opUILWkDXJGbD1DBMkfFzmVICzuIWZ-pCw/exec", function (data) {
	pesantren.addData(data);
	map.addLayer(pesantren);
	// map.fitBounds(pesantren.getBounds());
});

/* Ambulans */
var ambulans = L.geoJson(null, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {
			icon: ambulansMarker
		});
	},
	onEachFeature: function (feature, layer) {
		if (feature.properties) {
			var content = "<strong class='mb-3'>" + feature.properties.jenis_fasilitas + " " + feature.properties.jenis + "</strong>" +
				"<table class='table table-striped table-bordered'>" +
				"<tr><td>Jumlah Sopir (Driver)</td><td>" + feature.properties.driver + "</td></tr>" +
				"<tr><td>Jumlah Tenaga Medis</td><td>" + feature.properties.medis + "</td></tr>" +
				"<tr><td>Jumlah Tenaga Support</td><td>" + feature.properties.support + "</td></tr>" +
				"</table>"
			"<small>" + feature.properties.timestamp + "</small>";
			layer.on({
				click: function (e) {
					ambulans.bindPopup(content);
				},
				mouseover: function (e) {
					ambulans.bindTooltip(feature.properties.jenis_fasilitas + " " + feature.properties.jenis);
				}
			});
		}
	}
});
$.getJSON("https://script.google.com/macros/s/AKfycbxOALGPxCrkbyQsEH7lvi-yZjZwAV4hCX8U3X6WAol0lb93E2vZzQXWURL-rnDrJ9Q/exec", function (data) {
	ambulans.addData(data);
	map.addLayer(ambulans);
});

// Batas Administrasi
var batas_kabkot = L.geoJson(null, {
	/* Style batas_kabkot */
	style: function (feature) {
		return {
			color: "#4d4d4d",
			fillColor: "#ffffff",
			weight: 2,
			opacity: 1,
			fillOpacity: 0,
		};
	},
	onEachFeature: function (feature, layer) {
		var popupContent = feature.properties.NAMOBJ;
		layer.on({
			click: function (e) {
				batas_kabkot.bindPopup(popupContent);
			},
			mouseover: function (e) {
				batas_kabkot.bindTooltip(feature.properties.NAMOBJ, {
					sticky: true,
				});
			},
		});
	},
});
$.getJSON("data/batas_kabkot.geojson", function (data) {
	batas_kabkot.addData(data);
	map.addLayer(batas_kabkot);
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

var groupedOverlays = {
  "Aset": {
    "<i class='fa-solid fa-school'></i> Pesantren": pesantren,
    "<i class='fa-solid fa-truck-medical'></i> Ambulans": ambulans,
  },
	"Batas Administrasi": {
		"Batas Kabupaten/Kota": batas_kabkot
	},
  "Peta Bahaya": {
    "Bahaya Banjir": layer_bahaya_banjir,
		"Bahaya Cuaca Ekstrim": layer_bahaya_cuaca_ekstrim,
		"Bahaya Gempabumi": layer_bahaya_gempabumi,
		"Bahaya Kebakaran Hutan dan Lahan": layer_bahaya_kebakaran_hutan_dan_lahan,
		"Bahaya Kekeringan": layer_bahaya_kekeringan,
		"Bahaya Letusan Gunungapi": layer_bahaya_letusan_gunungapi,
		"Bahaya Tanah Longsor": layer_bahaya_tanah_longsor,
		"Bahaya Multi": layer_bahaya_multi
  }
};

L.control.groupedLayers(null, groupedOverlays, {collapsed: false}).addTo(map);

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
	this._div.innerHTML = `<strong>Indeks Bahaya</strong><br><img src="assets/images/legend_indeks_bahaya_kerentanan_risiko_bnpb.png" alt="indeks bahaya" width="150" height="15" class="mt-2"><br><small>Rendah&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tinggi</small>`;
};

legend.addTo(map);