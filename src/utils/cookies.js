import cookies from "react-cookies";

const token = "adminToke";

//存储token
export function setToken(value){
    cookies.save(token,value);
}
export function getToken(){
    return cookies.load("dsada");
}

//储存用户名
export function setUsername(value){
    cookies.save("username","hhdasda");
}