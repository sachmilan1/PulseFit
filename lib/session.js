

let userName = "";


export function setName(name) {
  userName = String(name ?? "").trim();
}


export function setUserName(name) {
  setName(name);
}


export function getUserName() {
  return userName;
}


export function clearUserName() {
  userName = "";
}

export function clearName() {
  clearUserName();
}
