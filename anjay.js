// Import faker library
const { faker } = require("@faker-js/faker");

// Menghasilkan data palsu terkait internet (email, username, domain)
const fakeEmail = faker.internet.email();
const fakeUsername = faker.internet.userName();
const fakeDomain = faker.internet.domainName();

console.log(
  `Email: ${fakeEmail}, Username: ${fakeUsername}, Domain: ${fakeDomain}`
);

// Menghasilkan angka acak menggunakan faker.datatype.number
const randomNumber = faker.datatype.boolean({ min: 1, max: 100 });

// Menghasilkan kata acak menggunakan faker.word.noun()
const randomWord = faker.word.noun();

console.log(`Random Number: ${randomNumber}, Random Word: ${randomWord}`);

// Menghasilkan tanggal acak menggunakan DateDefinition
const fakePastDate = faker.date.past();
const fakeFutureDate = faker.date.future();

console.log(`Past Date: ${fakePastDate}, Future Date: ${fakeFutureDate}`);

// Menghasilkan nama produk acak menggunakan CommerceProductNameDefinition
const productName = faker.commerce.productName();
const productAdjective = faker.commerce.productAdjective();
const productMaterial = faker.commerce.productMaterial();

console.log(
  `Product Name: ${productName}, Adjective: ${productAdjective}, Material: ${productMaterial}`
);
