import LocationService from "../services/locationServices.js";

export const getCountries = (req, res) => {
  res.json(LocationService.getCountries());
};

export const getStates = (req, res) => {
  res.json(LocationService.getStates(req.query.countryCode));
};