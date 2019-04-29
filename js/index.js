$(function(){

    function buildMap() {
        if (document.querySelector('#map').children.length > 0) return;
        centerLatLng = L.latLng('44.8931452', '-0.1560662');
        map = L.map('map', {
            center: centerLatLng,
            zoom: 9
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', osmAttribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
            ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        ).addTo(map)
    }
  
    buildMap();

    var marker;
    var newLatLng;

    map.on('dblclick', function(e) {

        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        console.log([lat, lng])
        let latLng = L.latLng([lat, lng]);
        console.log(latLng);
        addMarker(latLng);
        
    });



    $('#submit').on('click', function(e) {
        var input = $('input:text').val() + ", Gironde, France";
        e.preventDefault();
        var form = $(this);
        console.log(input);
        axios.get('http://open.mapquestapi.com/nominatim/v1/search.php?format=json', {
            params: {
                q: input,
                responseType: 'json',
                key: "QRKpq6evA0kWj774GqAIXpdPoT8chHzu"
            }
        }).then(function(response) {
            console.log(response.data[0].lat);
            let mapLat = response.data[0].lat;
            let mapLng = response.data[0].lon;
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);        
            };
            var latlng = L.latLng([mapLat, mapLng]);
            console.log(latlng);
            addMarker(latlng);
            

        })

    })


    function showAddress(info) {

        let popupInfo = "<div>"+ info +"</div>";
        marker.bindPopup(popupInfo).openPopup();

    }
    function addMarker(latlng){
        if(map.hasLayer(marker)){
            map.removeLayer(marker);
        }
        marker = new L.marker(latlng, {
            draggable: true
        });
        marker.on('dragend', function(e){
            newLatLng = L.latLng([marker.getLatLng().lat, marker.getLatLng().lng]);
            newLat = marker.getLatLng().lat,
            newLon = marker.getLatLng().lng,
            geoLatLng = geoSearch(newLat, newLon);

            showAddress(geoLatLng);
        })
        .addTo(map);


    }

    function geoSearch(lat, lon){
        axios.get('http://open.mapquestapi.com/nominatim/v1/reverse?format=json', {
            params: {
                lat: lat,
                lon: lon,
                responseType: 'json',
                key: "QRKpq6evA0kWj774GqAIXpdPoT8chHzu"
            }
        }).then(function(response){
            console.log(response.data.address);
            var dataToShow;
            for(var i in response.data.address){
                var data = response.data.address[i];

                dataToShow += data + "<br>"


            }
            showAddress(dataToShow);

        })
    }
    

});

