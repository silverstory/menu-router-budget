import { useEffect } from "react";
import { useState } from "react"

// const useLocalStorage = (key, initialValue) => {
//   const [value, setValue] = useState(() => {
//     try {
//       const localValue = window.localStorage.getItem(key);
//       return localValue ? JSON.parse(localValue) : initialValue;
//     } catch (err) {
//       console.log(err)
//       return initialValue;
//     }
//   })

//   useEffect(() => {
//     window.localStorage.setItem(key, JSON.stringify(value))
//   }, [key, value])

//   return [value, setValue]
// }

const useLocalStorage = (key, initialValue, id) => {
  const [value, setValue] = useState(() => {
    try {
      const localValue = window.localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : initialValue;
    } catch (err) {
      console.log(err)
      return initialValue;
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

// const useLocalStorage = (key, recipegroupId) => {
//   const [value, setValue] = useState(() => {
//     try {
//       const parsed = JSON.parse(localStorage.getItem(key));
//       const data = parsed ?? [];
//       return data.filter((item) => item["recipegroupId"] === recipegroupId);
//     } catch (err) {
//       console.log(err)
//       return [];
//     }
//   })

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value))
//   }, [key, value])

//   return [value, setValue]
// }


export default useLocalStorage