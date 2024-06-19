import { createContext } from "react";

export const defaultValue = {
    order: null,
    setOrder: () => { },
    transactionID: null,
    setTransactionID: () => { }
};

const TestContext = createContext(defaultValue);

export default TestContext;