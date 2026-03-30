import { Country, State } from "country-state-city";

class LocationService {

  static getCountries() {
    return Country.getAllCountries();
  }

  static getStates(countryCode) {
    if (!countryCode) return [];
    return State.getStatesOfCountry(countryCode);
  }

}

export default LocationService;
