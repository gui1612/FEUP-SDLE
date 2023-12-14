function initUserId() {
    var currentId = localStorage.getItem("id");
    if (currentId) return;
    
    const id = crypto.randomUUID();
    localStorage.setItem("id", id);
}

export function getUserId() {
    if (!localStorage.getItem("id")) initUserId();
    return localStorage.getItem("id")!;
}