const jwt = require('jsonwebtoken');

const validateToken = (token, history) => {
    return jwt.verify(token, 'secret', function (err, decoded) {
        if (err != null) {
            return false
        }
        return true
    });
}
const setInLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getfromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    if (data)
      return JSON.parse(data);
    return data;
}

const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
}
export {
    validateToken,
    setInLocalStorage,
    getfromLocalStorage,
    removeFromLocalStorage
};