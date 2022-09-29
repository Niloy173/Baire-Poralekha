const obj1 = {
  countryName: "AUSTRALIA",
  universityName: "Australia University",
  rank: "3434",
  type: "private",
  location: "South Town new jersy",
};

const obj2 = {
  countryName: "France",
  universityName: "Australia University",
  rank: "3434",
  type: "private",
  location: "South Town new jersy",
};

const obj3 = {
  countryName: "AUSTRALIA",
  universityName: "Australia University",
  rank: "3434",
  type: "private",
  location: "South Town new jersy",
};

const obj4 = {
  countryName: "Korea",
  universityName: "Australia University",
  rank: "3434",
  type: "private",
  location: "South Town new jersy",
};

const data = [obj1, obj2, obj3, obj4];

let array_of_country = [];

// data.forEach((each_obj) => {
//   // const keyToFetch = Object.keys(each_obj)[0];
//   const countryName = each_obj["countryName"];
//   if (array_of_country.indexOf(countryName) === -1) {
//     array_of_country.push(countryName);
//   }
// });

// const countries = data.map((value) => value.countryName);
// array_of_country = countries.filter((value, position, arr) => {
//   return arr.indexOf(value) === position;
// });

array_of_country = data
  .map((item) => item.countryName)
  .filter((value, position, array) => array.indexOf(value) === position);

console.log(array_of_country);
