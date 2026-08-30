import React, {
  useEffect,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import {
  Search,
  LocateFixed,
  Loader2,
  MapPin,
  Check,
  X,
} from "lucide-react";

import "leaflet/dist/leaflet.css";


/* =====================================================
   LEAFLET MARKER
===================================================== */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


/* =====================================================
   DEFAULT LOCATION
===================================================== */

const DEFAULT_LOCATION = {
  lat: 20.2961,
  lng: 85.8245,
};


/* =====================================================
   MAP CONTROLLER
===================================================== */

function MapController({
  position,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      !position ||
      !Number.isFinite(position.lat) ||
      !Number.isFinite(position.lng)
    ) {
      return;
    }

    map.flyTo(
      [
        position.lat,
        position.lng,
      ],
      18,
      {
        duration: 0.7,
      }
    );
  }, [
    position?.lat,
    position?.lng,
    map,
  ]);

  return null;
}


/* =====================================================
   MAP CLICK
===================================================== */

function MapClickHandler({
  onSelect,
}) {
  useMapEvents({
    click(event) {
      onSelect(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}


/* =====================================================
   LOCATION MAP
===================================================== */

export default function LocationMap({
  onSelect,
  initialLocation,
}) {

  /* ===================================================
     POSITION
  =================================================== */

  const [
    position,
    setPosition,
  ] = useState(() => {

    const lat = Number(
      initialLocation?.latitude ??
      initialLocation?.lat ??
      DEFAULT_LOCATION.lat
    );

    const lng = Number(
      initialLocation?.longitude ??
      initialLocation?.lng ??
      DEFAULT_LOCATION.lng
    );

    return {
      lat: Number.isFinite(lat)
        ? lat
        : DEFAULT_LOCATION.lat,

      lng: Number.isFinite(lng)
        ? lng
        : DEFAULT_LOCATION.lng,
    };
  });


  /* ===================================================
     SEARCH
  =================================================== */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    searchResults,
    setSearchResults,
  ] = useState([]);

  const [
    searchLoading,
    setSearchLoading,
  ] = useState(false);

  const [
    showResults,
    setShowResults,
  ] = useState(false);


  /* ===================================================
     ADDRESS
  =================================================== */

  const [
    address,
    setAddress,
  ] = useState(
    initialLocation?.formattedAddress ||
    initialLocation?.address ||
    ""
  );


  /* ===================================================
     LOCATION DATA
  =================================================== */

  const [
    locationData,
    setLocationData,
  ] = useState(
    initialLocation || null
  );


  const [
    loadingAddress,
    setLoadingAddress,
  ] = useState(false);


  const [
    gpsLoading,
    setGpsLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* ===================================================
     SYNC PARENT → MAP
  =================================================== */

  useEffect(() => {

    if (!initialLocation) {
      return;
    }

    const lat = Number(
      initialLocation.latitude ??
      initialLocation.lat
    );

    const lng = Number(
      initialLocation.longitude ??
      initialLocation.lng
    );

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }

    setPosition({
      lat,
      lng,
    });

    setLocationData(
      initialLocation
    );

    setAddress(
      initialLocation.formattedAddress ||
      initialLocation.address ||
      ""
    );

  }, [
    initialLocation?.latitude,
    initialLocation?.longitude,
    initialLocation?.lat,
    initialLocation?.lng,
    initialLocation?.formattedAddress,
    initialLocation?.address,
  ]);


  /* ===================================================
     BUILD LOCATION OBJECT
  =================================================== */

  const buildLocation = (
    result,
    lat,
    lng,
    accuracy = null
  ) => {

    const addr =
      result?.address || {};

    return {

      latitude:
        Number(lat),

      longitude:
        Number(lng),

      /* MongoDB GeoJSON */
      location: {
        type: "Point",

        /* IMPORTANT:
           [longitude, latitude]
        */

        coordinates: [
          Number(lng),
          Number(lat),
        ],
      },

      accuracy,

      formattedAddress:
        result?.display_name ||
        "",

      address:
        result?.display_name ||
        "",

      plotNumber:
        addr.plot_number ||
        addr.plot ||
        "",

      houseNumber:
        addr.house_number ||
        "",

      buildingName:
        addr.building ||
        addr.building_name ||
        addr.house_name ||
        "",

      flatNumber:
        addr.unit ||
        addr.flat ||
        "",

      floor:
        addr.floor ||
        "",

      road:
        addr.road ||
        addr.street ||
        "",

      street:
        addr.street ||
        addr.road ||
        "",

      landmark:
        addr.landmark ||
        "",

      neighbourhood:
        addr.neighbourhood ||
        "",

      suburb:
        addr.suburb ||
        "",

      area:
        addr.quarter ||
        addr.residential ||
        addr.subdivision ||
        "",

      locality:
        addr.locality ||
        addr.city_district ||
        "",

      city:
        addr.city ||
        addr.town ||
        addr.village ||
        "",

      district:
        addr.county ||
        addr.district ||
        "",

      state:
        addr.state ||
        "",

      pincode:
        addr.postcode ||
        "",

      postalCode:
        addr.postcode ||
        "",

      country:
        addr.country ||
        "",

      countryCode:
        (
          addr.country_code ||
          ""
        ).toUpperCase(),

      placeName:
        result?.name ||
        "",

      osmType:
        result?.osm_type ||
        "",

      osmId:
        result?.osm_id ||
        null,

      placeId:
        result?.place_id ||
        null,

      category:
        result?.category ||
        "",

      type:
        result?.type ||
        "",
    };
  };


  /* ===================================================
     SEND TO NAVBAR / PARENT
  =================================================== */

  const sendToParent = (
    finalLocation
  ) => {

    console.log(
      "📤 LOCATION → NAVBAR"
    );

    console.log(
      "Latitude:",
      finalLocation.latitude
    );

    console.log(
      "Longitude:",
      finalLocation.longitude
    );

    console.log(
      "Address:",
      finalLocation.formattedAddress
    );

    console.log(
      "GeoJSON:",
      finalLocation.location
    );

    console.log(
      "FULL LOCATION:",
      finalLocation
    );

    if (
      typeof onSelect ===
      "function"
    ) {

      onSelect(
        finalLocation.latitude,
        finalLocation.longitude,
        finalLocation
      );
    }
  };


  /* ===================================================
     REVERSE GEOCODING
  =================================================== */

  const reverseGeocode = async (
    lat,
    lng,
    accuracy = null
  ) => {

    setLoadingAddress(true);
    setError("");

    try {

      const url =
        "https://nominatim.openstreetmap.org/reverse" +
        `?format=jsonv2` +
        `&lat=${encodeURIComponent(lat)}` +
        `&lon=${encodeURIComponent(lng)}` +
        "&zoom=18" +
        "&addressdetails=1" +
        "&extratags=1";

      const response =
        await fetch(url, {
          headers: {
            Accept:
              "application/json",
          },
        });

      if (!response.ok) {
        throw new Error(
          "Reverse geocoding failed"
        );
      }

      const result =
        await response.json();

      const finalLocation =
        buildLocation(
          result,
          lat,
          lng,
          accuracy
        );

      setPosition({
        lat: Number(lat),
        lng: Number(lng),
      });

      setAddress(
        finalLocation.formattedAddress
      );

      setLocationData(
        finalLocation
      );

      sendToParent(
        finalLocation
      );

      return finalLocation;

    } catch (err) {

      console.error(
        "❌ REVERSE GEOCODE ERROR:",
        err
      );

      const fallback = {

        latitude:
          Number(lat),

        longitude:
          Number(lng),

        location: {
          type: "Point",

          coordinates: [
            Number(lng),
            Number(lat),
          ],
        },

        accuracy,

        formattedAddress:
          `${Number(lat).toFixed(8)}, ${Number(lng).toFixed(8)}`,

        address:
          `${Number(lat).toFixed(8)}, ${Number(lng).toFixed(8)}`,
      };

      setPosition({
        lat: Number(lat),
        lng: Number(lng),
      });

      setAddress(
        fallback.formattedAddress
      );

      setLocationData(
        fallback
      );

      sendToParent(
        fallback
      );

      setError(
        "Address details could not be found, but coordinates were saved."
      );

      return fallback;

    } finally {

      setLoadingAddress(false);
    }
  };


  /* ===================================================
     SELECT MAP LOCATION
  =================================================== */

  const selectLocation = async (
    lat,
    lng,
    accuracy = null
  ) => {

    const latitude =
      Number(lat);

    const longitude =
      Number(lng);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    console.log(
      "📍 MAP LOCATION:",
      {
        latitude,
        longitude,
      }
    );

    setPosition({
      lat: latitude,
      lng: longitude,
    });

    await reverseGeocode(
      latitude,
      longitude,
      accuracy
    );
  };


  /* ===================================================
     SEARCH
  =================================================== */

  const searchLocation = async (
    event
  ) => {

    event?.preventDefault();

    const query =
      search.trim();

    if (!query) {
      return;
    }

    setSearchLoading(true);
    setError("");
    setShowResults(true);

    try {

      console.log(
        "🔎 SEARCH:",
        query
      );

      const url =
        "https://nominatim.openstreetmap.org/search" +
        `?format=jsonv2` +
        `&q=${encodeURIComponent(query)}` +
        "&countrycodes=in" +
        "&addressdetails=1" +
        "&extratags=1" +
        "&limit=5";

      const response =
        await fetch(url, {
          headers: {
            Accept:
              "application/json",
          },
        });

      if (!response.ok) {
        throw new Error(
          "Search failed"
        );
      }

      const results =
        await response.json();

      console.log(
        "🌍 SEARCH RESULTS:",
        results
      );

      setSearchResults(
        results
      );

      if (!results.length) {

        setError(
          "No location found. Try plot number, house number, road, area, city or pincode."
        );
      }

    } catch (err) {

      console.error(
        "❌ SEARCH ERROR:",
        err
      );

      setSearchResults([]);

      setError(
        "Unable to search location."
      );

    } finally {

      setSearchLoading(false);
    }
  };


  /* ===================================================
     SELECT SEARCH RESULT
  =================================================== */

  const selectSearchResult = (
    result
  ) => {

    const lat =
      Number(result.lat);

    const lng =
      Number(result.lon);

    console.log(
      "📌 SEARCH RESULT:",
      result
    );

    /*
     * Move map.
     */

    setPosition({
      lat,
      lng,
    });


    /*
     * Build exact location
     * from SAME search result.
     */

    const finalLocation =
      buildLocation(
        result,
        lat,
        lng
      );


    /*
     * Update text.
     */

    setSearch(
      result.display_name ||
      ""
    );

    setAddress(
      finalLocation.formattedAddress
    );


    /*
     * Update state.
     */

    setLocationData(
      finalLocation
    );


    /*
     * Close dropdown.
     */

    setSearchResults([]);

    setShowResults(false);


    /*
     * Send exact same location
     * to Navbar.
     */

    sendToParent(
      finalLocation
    );
  };


  /* ===================================================
     CURRENT LOCATION
  =================================================== */

  const handleCurrentLocation =
    () => {

      if (
        !navigator.geolocation
      ) {

        setError(
          "Geolocation is not supported by your browser."
        );

        return;
      }

      setGpsLoading(true);
      setError("");

      navigator.geolocation.getCurrentPosition(

        async (
          geoPosition
        ) => {

          const {
            latitude,
            longitude,
            accuracy,
          } =
            geoPosition.coords;

          console.log(
            "📍 GPS:",
            {
              latitude,
              longitude,
              accuracy,
            }
          );

          await selectLocation(
            latitude,
            longitude,
            accuracy
          );

          setGpsLoading(false);
        },

        (geoError) => {

          console.error(
            "❌ GPS ERROR:",
            geoError
          );

          setGpsLoading(false);

          setError(
            geoError.message ||
            "Unable to get current location."
          );
        },

        {
          enableHighAccuracy:
            true,

          timeout:
            20000,

          maximumAge:
            0,
        }
      );
    };


  /* ===================================================
     MARKER DRAG
  =================================================== */

  const handleMarkerDragEnd =
    async (
      event
    ) => {

      const latLng =
        event.target.getLatLng();

      console.log(
        "📌 MARKER DRAG:",
        latLng
      );

      await selectLocation(
        latLng.lat,
        latLng.lng
      );
    };


  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="w-full">

      {/* =================================================
          ONLY ONE SEARCH INPUT
      ================================================= */}

      <div className="relative z-[2000] mb-3">

        <form
          onSubmit={
            searchLocation
          }
          className="flex gap-2"
        >

          <div className="relative flex-1">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {

                setSearch(
                  event.target.value
                );

                if (
                  !event.target.value.trim()
                ) {

                  setSearchResults([]);

                  setShowResults(false);
                }
              }}
              placeholder="Search address, plot, road, area or pincode..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

          </div>


          <button
            type="submit"
            disabled={
              searchLoading ||
              !search.trim()
            }
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {searchLoading ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Search size={17} />
            )}

            <span className="hidden sm:inline">
              Search
            </span>

          </button>

        </form>


        {/* SEARCH RESULTS */}

        {showResults &&
          searchResults.length > 0 && (

            <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">

              {searchResults.map(
                (
                  result,
                  index
                ) => (

                  <button
                    key={
                      result.place_id ||
                      index
                    }
                    type="button"
                    onClick={() =>
                      selectSearchResult(
                        result
                      )
                    }
                    className="flex w-full items-start gap-3 border-b border-slate-100 p-3 text-left transition hover:bg-indigo-50"
                  >

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">

                      <MapPin
                        size={16}
                      />

                    </div>


                    <div className="min-w-0">

                      <p className="text-xs font-bold text-slate-800">
                        {result.name ||
                          "Location"}
                      </p>

                      <p className="mt-1 line-clamp-3 text-[11px] leading-4 text-slate-500">
                        {
                          result.display_name
                        }
                      </p>

                    </div>

                  </button>

                )
              )}

            </div>
          )}

      </div>


      {/* =================================================
          MAP
      ================================================= */}

      <div className="relative overflow-hidden rounded-2xl border border-slate-200">

        <MapContainer
          center={[
            position.lat,
            position.lng,
          ]}
          zoom={18}
          scrollWheelZoom
          className="h-[330px] w-full sm:h-[400px]"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            position={position}
          />

          <MapClickHandler
            onSelect={
              selectLocation
            }
          />

          <Marker
            position={[
              position.lat,
              position.lng,
            ]}
            draggable
            eventHandlers={{
              dragend:
                handleMarkerDragEnd,
            }}
          />

        </MapContainer>


        {/* CURRENT LOCATION */}

        <button
          type="button"
          onClick={
            handleCurrentLocation
          }
          disabled={
            gpsLoading
          }
          className="absolute right-3 top-3 z-[1000] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-indigo-600 shadow-lg transition hover:bg-indigo-50 disabled:opacity-60"
          title="Use current location"
        >

          {gpsLoading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <LocateFixed
              size={18}
            />
          )}

        </button>


        {/* COORDINATES */}

        <div className="absolute bottom-3 left-3 z-[1000] rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur">

          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            Exact coordinates
          </p>

          <p className="text-[10px] font-bold text-slate-700">
            {position.lat.toFixed(8)}
            {" , "}
            {position.lng.toFixed(8)}
          </p>

        </div>

      </div>


      {/* =================================================
          SELECTED ADDRESS
      ================================================= */}

      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">

            <MapPin
              size={18}
              className="text-indigo-600"
            />

          </div>


          <div className="min-w-0 flex-1">

            <div className="flex items-center justify-between gap-2">

              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Selected location
              </p>

              {locationData && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">

                  <Check
                    size={12}
                  />

                  Selected

                </span>
              )}

            </div>


            <p className="mt-1 break-words text-sm font-bold leading-5 text-slate-800">

              {loadingAddress
                ? "Finding address..."
                : address ||
                  "Search or select a location"}

            </p>

          </div>

        </div>


        {/* DETAILS */}

        {locationData && (

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">

            <Info
              label="Plot / House"
              value={
                locationData.plotNumber ||
                locationData.houseNumber
              }
            />

            <Info
              label="Building"
              value={
                locationData.buildingName
              }
            />

            <Info
              label="Flat"
              value={
                locationData.flatNumber
              }
            />

            <Info
              label="Floor"
              value={
                locationData.floor
              }
            />

            <Info
              label="Road"
              value={
                locationData.road
              }
            />

            <Info
              label="Area"
              value={
                locationData.area ||
                locationData.suburb
              }
            />

            <Info
              label="Locality"
              value={
                locationData.locality
              }
            />

            <Info
              label="City"
              value={
                locationData.city
              }
            />

            <Info
              label="District"
              value={
                locationData.district
              }
            />

            <Info
              label="State"
              value={
                locationData.state
              }
            />

            <Info
              label="Pincode"
              value={
                locationData.pincode
              }
            />

            <Info
              label="Country"
              value={
                locationData.country
              }
            />

          </div>
        )}


        {/* DATABASE LOCATION */}

        {locationData && (

          <div className="mt-3 rounded-xl bg-indigo-50 px-3 py-2">

            <p className="text-[9px] font-black uppercase tracking-wider text-indigo-500">
              Database location
            </p>

            <p className="mt-1 text-xs font-bold text-slate-700">
              Latitude:{" "}
              {Number(
                locationData.latitude
              ).toFixed(8)}
            </p>

            <p className="text-xs font-bold text-slate-700">
              Longitude:{" "}
              {Number(
                locationData.longitude
              ).toFixed(8)}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              GeoJSON: [
              {Number(
                locationData.longitude
              ).toFixed(8)}
              ,{" "}
              {Number(
                locationData.latitude
              ).toFixed(8)}
              ]
            </p>

          </div>
        )}


        {/* ERROR */}

        {error && (

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">

            <X
              size={15}
              className="mt-0.5 shrink-0"
            />

            <span>
              {error}
            </span>

          </div>
        )}

      </div>

    </div>
  );
}


/* =====================================================
   INFO
===================================================== */

function Info({
  label,
  value,
}) {

  if (!value) {
    return null;
  }

  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">

      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}

