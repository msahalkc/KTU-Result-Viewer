export function removeNullProperties(obj) {
    for (const prop in obj) {
      if (obj[prop] === null) {
        delete obj[prop];
      } else if (typeof obj[prop] === "object") {
        removeNullProperties(obj[prop]);
      }
    }
    return obj;
  }