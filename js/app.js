// ================================
// Membuat Peta
// ================================

let map = L.map("map").setView([-7.759574089457855, 110.4087181274947], 11);
let geojsonData = null;
let wilayahLayer = null;
let selectedLayer = null;

// ================================
// Menambahkan OpenTopoMap
// ================================

let openTopoMap = L.tileLayer("https://tile.opentopomap.org/{z}/{x}/{y}.png", {
  attribution:
    "Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap",
}).addTo(map);
let openStretMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      "Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap",
  },
);

// ================================
// Membaca Data GeoJSON
// ================================
fetch("data/diy-demografi.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    geojsonData = data;
    // Menambahkan GeoJSON ke dalam map
    wilayahLayer = L.geoJSON(data, {
      style: function (feature) {
        return {
          color: feature.properties.stroke,
          fillColor: feature.properties.fill,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        };
      },
      onEachFeature: function (feature, layer) {
        let popupContent = `
    <div class="popup-content">

        <div
            class="popup-header"
            style="border-left-color: ${feature.properties.fill};"
        >
            <h3>${feature.properties.nama}</h3>
            <span>Informasi Wilayah</span>
        </div>

        <div class="popup-item">
            <span class="popup-label">Jumlah Penduduk</span>
            <strong>${feature.properties.jumlah_penduduk} jiwa</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Luas Wilayah</span>
            <strong>${feature.properties.luas_wilayah_km2} km²</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Kepadatan Penduduk</span>
            <strong>${feature.properties.kepadatan} jiwa/km²</strong>
        </div>

    </div>
`;

        layer.bindPopup(popupContent);
      },
    }).addTo(map);

    geojsonData.features.forEach(function (feature) {
      let option = document.createElement("option");
      option.value = feature.properties.nama;
      option.textContent = feature.properties.nama;
      wilayahSelect.appendChild(option);
    });

    wilayahSelect.addEventListener("change", function () {
      let selectedName = wilayahSelect.value;

      let selectedFeature = geojsonData.features.find(function (feature) {
        return feature.properties.nama === selectedName;
      });

      if (selectedLayer) {
        map.removeLayer(selectedLayer);
      }

      if (selectedName === "") {
        return;
      }

      selectedLayer = L.geoJSON(selectedFeature, {
        style: function (feature) {
          return {
            color: feature.properties.stroke,
            fillColor: feature.properties.fill,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          };
        },
        onEachFeature: function (feature, layer) {
          let popupContent = `
            <div class="popup-content">
                <div
                    class="popup-header"
                    style="border-left-color: ${feature.properties.fill};"
                >
                    <h3>${feature.properties.nama}</h3>
                    <span>Informasi Wilayah</span>
                </div>

                <div class="popup-item">
                    <span class="popup-label">
                        Jumlah Penduduk
                    </span>

                    <strong>
                        ${feature.properties.jumlah_penduduk} jiwa
                    </strong>
                </div>

                <div class="popup-item">
                    <span class="popup-label">
                        Luas Wilayah
                    </span>

                    <strong>
                        ${feature.properties.luas_wilayah_km2} km²
                    </strong>
                </div>

                <div class="popup-item">
                    <span class="popup-label">
                        Kepadatan Penduduk
                    </span>

                    <strong>
                        ${feature.properties.kepadatan} jiwa/km²
                    </strong>
                </div>
            </div>
        `;
          layer.bindPopup(popupContent);
        },
      }).addTo(map);

      map.fitBounds(selectedLayer.getBounds());
    });

    let baseMaps = {
      OpenTopoMap: openTopoMap,
      OpenStreetMap: openStretMap,
    };

    let overlays = {
      "Wilayah Kabupaten/Kota": wilayahLayer,
    };

    L.control
      .layers(baseMaps, overlays, {
        position: "topright",
        autoZIndex: true,
      })
      .addTo(map);
  });

// ================================
// Mengambil Elemen HTML
// ================================

let tombolPeta = document.getElementById("btn-peta");
let mapElement = document.getElementById("map");
let mapPlaceholder = document.getElementById("map-placeholder");
let wilayahSelect = document.getElementById("wilayah-select");
let mapLegend = document.querySelector(".map-legend");

// ================================
// Kondisi Awal
// ================================

mapElement.style.display = "none";
mapPlaceholder.style.display = "flex";
tombolPeta.textContent = "Tampilkan Peta";
mapLegend.style.display = "none";

// ================================
// Event Tombol Peta
// ================================

tombolPeta.addEventListener("click", function () {
  if (mapElement.style.display === "none") {
    // Menampilkan peta
    mapElement.style.display = "block";

    // Menyembunyikan placeholder
    mapPlaceholder.style.display = "none";

    // Mengubah teks tombol
    tombolPeta.textContent = "Sembunyikan Peta";

    // Menampilkan legend
    mapLegend.style.display = "block";

    // Memberitahu Leaflet bahwa ukuran map berubah
    window.setTimeout(function () {
      map.invalidateSize();
    }, 100);
  } else {
    // Menyembunyikan peta
    mapElement.style.display = "none";

    // Menampilkan placeholder
    mapPlaceholder.style.display = "flex";

    // Mengubah teks tombol
    tombolPeta.textContent = "Tampilkan Peta";

    // Menyembunyikan legend
    mapLegend.style.display = "none";
  }
});
