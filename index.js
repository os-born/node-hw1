const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts");

listContacts();
getContactById("9");
removeContact("10");
addContact("Petro", "petro@mail.com", "329-9832");
