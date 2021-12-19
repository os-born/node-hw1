const { v4: uuidv4 } = require("uuid");

const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parsedData = JSON.parse(data);
    console.table(parsedData);
    return parsedData;
  } catch (error) {
    console.log("Can't get contacts list!", error);
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  if (!contact) {
    return console.log(`Can't find contact with ID: ${contactId}!`);
  }
  return console.log(JSON.stringify(contact));
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const isRemoved = contacts.find(({ id }) => id === contactId);
    if (!isRemoved) {
      console.log(`Contact with ID: ${contactId} is not found!`);
      return;
    }
    const editedContactList = contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(editedContactList));
    return console.log(
      `Contact with ID: ${contactId} was successfully removed!`
    );
  } catch (error) {
    console.log(`Contact with ID: ${contactId} is not found!`, error);
  }
}

async function addContact(name, email, phone) {
  if (!name || !email || !phone) {
    console.log(
      `Type all parameters, please! For example: "Petro", "petro@mail.com", "329-9832"`
    );
  }
  const contacts = await listContacts();
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  const updatedContactList = [...contacts, newContact].sort(
    (a, b) => a.id - b.id
  );
  const normalizedNewContacts = JSON.stringify(updatedContactList);
  fs.writeFile(contactsPath, normalizedNewContacts);
  console.log(
    `Contact: ${JSON.stringify(newContact.name)} was successfully added!`
  );
  return listContacts();
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
