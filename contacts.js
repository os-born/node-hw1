const { v4: uuidv4 } = require("uuid");

const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.error("Can't get contacts list!", error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(
      ({ id }) => id.toString() === contactId.toString()
    );
    return contact ? contact : `Can't find contact with ID: ${contactId}!`;
  } catch (error) {
    console.error("Something wrong!", error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const isRemoved = contacts.find(
      ({ id }) => id.toString() === contactId.toString()
    );
    if (!isRemoved) {
      console.log(`Contact with ID: ${contactId} is not found!`);
      return;
    }
    const editedContactList = contacts.filter(
      ({ id }) => id.toString() !== contactId.toString()
    );
    await fs.writeFile(contactsPath, JSON.stringify(editedContactList));
    console.log(`Contact with ID: ${contactId} was successfully removed!`);
    return await listContacts();
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
