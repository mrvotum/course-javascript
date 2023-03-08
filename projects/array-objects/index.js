/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами.
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   forEach([1, 2, 3], (el) => console.log(el)); // выведет каждый элемент массива
 */
const forEach = (arr, fn) => {
  (function recursive(arr) {
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];

      if (element instanceof Array) {
        recursive(element);
      } else {
        fn(element, index, arr);
      }
    }
  })(arr);
};

// forEach([1, 0, [1, 2, 3]], (...el) => console.log(...el))

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами.
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   const newArray = map([1, 2, 3], (el) => el ** 2);
   console.log(newArray); // выведет [1, 4, 9]
 */

const map = (arr, fn) => {
  const newArr = [];

  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];

    newArr.push(fn(element, index, arr));
  }

  return newArr;
};

// const newArray = [1, 2, 3].map(item => item ** 2);

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами.
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   const sum = reduce([1, 2, 3], (all, current) => all + current);
   console.log(sum); // выведет 6
 */
function reduce(arr, fn, init = arr[0]) {
  let sum = init;
  const indexStart = sum === arr[0] ? 1 : 0;

  for (let i = indexStart; i < arr.length; i++) {
    const element = arr[i];

    sum = fn(sum, element, i, arr);
  }

  return sum;
}

// const sum = reduce([1, 3, 5], (all, current) => all + current, 10);

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   const keys = upperProps({ name: 'Сергей', lastName: 'Петров' });
   console.log(keys) // выведет ['NAME', 'LASTNAME']
 */
const upperProps = (obj) => {
  const arr = [];

  for (const key in obj) {
    arr.push(key.toUpperCase());
  }

  return arr;
};

export { forEach, map, reduce, upperProps };
