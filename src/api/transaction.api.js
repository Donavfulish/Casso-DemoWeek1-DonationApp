import api from "./index.js";

export const getTransactionList = ({fiServiceId, accountNumber}) => {
    api.get("transaction/list", {fiServiceId, accountNumber});
}
