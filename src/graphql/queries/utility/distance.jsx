function filter_master_by_distance(max_distance_in_km, my_lat, my_long, values) {
  /*
  Distance calculation: https://www.movable-type.co.uk/scripts/latlong.html
   */
  let return_values = [];

  const R = 6371e3; // diameter of the Earth

  const φ1 = (my_lat * Math.PI) / 180.0;

  for (let i = 0; i < values.length; i++) {
    const single_value = values[i];
    const lat2 = single_value['Actor1Geo_Lat'];
    const lon2 = single_value['Actor1Geo_Long'];

    const φ2 = (lat2 * Math.PI) / 180.0;

    const Δφ = ((lat2 - my_lat) * Math.PI) / 180;
    const Δλ = ((lon2 - my_long) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = (R * c) / 1000.0; // in kilometres

    if (d <= max_distance_in_km) {
      return_values.push(single_value);
    }
  }
  return return_values;
}
exports.filter_master_by_distance = filter_master_by_distance;
