 
        mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
            //projection: 'globe', // display the map as a globe
            zoom: 10, // initial zoom level, 0 is the world view, higher values zoom in
            center: school.geometry.coordinates, // center the map on this longitude and latitude
        });

        const marker = new mapboxgl.Marker()
        .setLngLat(school.geometry.coordinates,)
        .setPopup(
            new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h3>${school.title}</h3><p>${school.location}</p>`
            )
        )
        .addTo(map)

        map.addControl(new mapboxgl.NavigationControl());
        map.scrollZoom.disable();

        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style
        });
   