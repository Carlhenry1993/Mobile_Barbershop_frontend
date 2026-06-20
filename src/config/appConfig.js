export const APP_CONFIG = {
  brandName: "Mr. Renaudin Barbershop",
  shortName: "Mr. Renaudin",
  tagline: "Votre style, notre passion",
  apiBaseUrl: process.env.REACT_APP_API_URL || "https://mobile-barbershop-backend.onrender.com",
  websiteUrl: "https://www.mrrenaudinbarbershop.com",
  currency: "CAD",
  phone: "514-778-8318",
  email: "mrrenaudinbarber@gmail.com",
  address: {
    line1: "462 4e Rue de la Pointe",
    city: "Shawinigan",
    region: "QC",
    postalCode: "G9N 1G7",
    country: "Canada",
  },
  mapQuery: "462 4e Rue de la Pointe Shawinigan QC G9N 1G7",
  hours: [
    { label: "Lundi - Vendredi", value: "11h00 - 19h00" },
    { label: "Samedi", value: "12h00 - 19h00" },
    { label: "Dimanche", value: "11h00 - 17h00" },
  ],
};

export const fullAddress = `${APP_CONFIG.address.line1}, ${APP_CONFIG.address.city}, ${APP_CONFIG.address.region} ${APP_CONFIG.address.postalCode}, ${APP_CONFIG.address.country}`;
