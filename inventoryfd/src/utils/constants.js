const appRoute = {
    login: "/",
    dashboard: "/dashboard",
    inventories: "/inventories",
    addInventories: "/addInventories",
    users: "/users",

};

const apiEndPoint = {
    login: "/api/token",
    register: "/api/users/register",
    list: "/api/stores/InventoryLists",
    listadd: "/api/stores/InventoryAddCreate",
    pending: "/api/stores/InventoryListPending",
    pendingcount: "/api/stores/InventoryListPendingCount",
    approvecount: "/api/stores/InventoryApproveCount",
    totalcount: "/api/stores/Inventorycount",
    listuser: "/api/users/ListUser",
    approval: "/api/stores/InventoryApprove",

};

export { appRoute, apiEndPoint };