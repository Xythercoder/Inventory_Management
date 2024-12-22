const appRoute = {
    login: "/",
    signup: "/Signup",
    dashboard: "/dashboard",
    pending: "/pending",
    approved: "/approved",
    addInventories: "/addInventories",
    users: "/users",
    pending_graph: "/pending_graph",
    approved_graph: "/approved_graph",

};

const apiEndPoint = {
    login: "api/login/",
    logout: "api/logout/",
    register: "/api/users/register/",
    listadd: "/api/stores/inventory/",
    list: "/api/stores/inventory/",
    update_inventories: (id) => `/api/stores/inventory/${id}/`,
    patch_inventories: (id) => `/api/stores/approved_inventory/${id}/`,
    delete_inventories: (id) => `/api/stores/inventory/${id}/`,
    inventories_total_count: "/api/stores/total_inventory_count/",
    inventories_pending_count: "/api/stores/pending_inventory_count/",
    inventories_approved_count: "/api/stores/approved_inventory_count/",
    pending_notification: "/api/stores/pending_notification/",
    approved_notification: "/api/stores/approved_notification/",
    listuser: "/api/users/list_user/",
    approval: "/api/users/grant_crud/",
    total_user_count: "/api/users/total_user_count/",

};

export { appRoute, apiEndPoint };