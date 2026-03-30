import express from "express";
import { getCountries, getStates } from "../controllers/locationController.js";

const router = express.Router();

router.get("/countries", getCountries);
router.get("/states/:countryCode", getStates);

export default router;
