import api from "./index";

export const getGrantToken = (id) =>
  api.post("/token/grant", {
    fiServiceId: id,
    scopes: "transaction",
    redirectUri: "http://localhost:3000/success",
    language: "vi",
  });

export const exchangeToken = ({ publicToken, fiFullName, logo }) =>
  api.post("/token/exchange", { publicToken, fiFullName, logo });

export const removeGrant = (fiServiceId, accountNumber) =>
  api.post("/token/remove", { fiServiceId, accountNumber });
