#!/usr/bin/env fish

mkdir -p ~/repos/navigation/osrm-backend/
cd ~/repos/navigation/osrm-backend/ || exit

set docker "ghcr.io/project-osrm/osrm-backend"
set region "http://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf"
set osm_file (path basename "$region")
set osrm_file (string replace ".osm.pbf" ".osrm" "$osm_file")

[ -e "$osm_file" ] || aria2c "$region" -o "$osm_file"

printf "EXTRACTING MAPS...\n"
[ -e "$osrm_file.edges" -a -e "$osrm_file.names" ]
or docker run -t -v "$PWD:/data" $docker osrm-extract -p "/opt/car.lua" "/data/$osm_file"
clear

printf "PARTITIONING MAPS...\n"
[ -e "$osrm_file.cells" ] || begin
    docker run -tv "$PWD:/data" $docker osrm-partition "/data/$osrm_file"
    docker run -tv "$PWD:/data" $docker osrm-customize "/data/$osrm_file"
end
clear

printf "STARTING SERVER...\n"
echo "$osm_file" "$osrm_file"
docker run -t -i -p 5000:5000 -v "$PWD:/data" $docker osrm-routed --algorithm mld "/data/$osrm_file"
