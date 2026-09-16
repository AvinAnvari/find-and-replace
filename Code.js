/**
 * Function that is called by google app script by default and loads the CardService and Add on menu.
 * @returns {Card} the UI that is added to the right side of the screen
 */
function onHomepage() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const builder = CardService.newCardBuilder();

  builder.addSection(
    CardService.newCardSection()
      .addWidget(
        CardService.newTextParagraph().setText(
          "Please specify the name you'd like on the folder which will contain the edited files:",
        ),
      )
      .addWidget(
        CardService.newTextInput()
          .setFieldName("newFolderName")
          .setTitle(`e.g. "Edited Files Folder"`)
          .setHint(
            "Leave blank if you'd like the folder created within your own folder",
          )
          .setValue(""),
      )
      .addWidget(
        CardService.newButtonSet()
          .addButton(
            CardService.newTextButton()
              .setText("How To")
              .setOnClickAction(
                CardService.newAction().setFunctionName("howTo"),
              ),
          )
          //     .addButton(CardService.newTextButton()
          //     .setText("Run Function")
          //     .setOnClickAction(
          //       CardService.newAction()
          //       .setFunctionName("getEachDocument")
          //   )
          // )
          .addButton(
            CardService.newTextButton()
              .setText("Select Folder")
              .setOnClickAction(
                CardService.newAction().setFunctionName("openFolderPicker"),
              ),
          ),
      ),
  );

  return builder.build();
}

/**
 * Function that is called by onHomepage and will display dialog box with information on how to use the app.
 */
function howTo() {
  const ui = SpreadsheetApp.getUi();

  const html = HtmlService.createHtmlOutputFromFile("index")
    .setWidth(650)
    .setHeight(520);
  ui.showModalDialog(html, "How to");
}

/**
 * A function that is called by the server-side containing API information.
 * @returns {object} containing OAuthToken, App Id, and API key.
 */
function getPickerData() {
  return {
    token: ScriptApp.getOAuthToken(),
    appId: "894291576093",
    developerKey:
      PropertiesService.getScriptProperties().getProperty("PICKER_API_KEY"),
  };
}

/**
 * A function that calls the client-side and the picker.
 * @param {eventObject} e the event object
 */
function openFolderPicker(e) {
  const folderName =
    e?.commonEventObject?.formInputs?.newFolderName?.stringInputs?.value?.[0] ??
    "";
  PropertiesService.getUserProperties().setProperty(
    "newFolderName",
    folderName,
  );

  const ui = SpreadsheetApp.getUi();
  const html = HtmlService.createHtmlOutputFromFile("FolderPicker")
    .setWidth(650)
    .setHeight(520);
  ui.showModalDialog(html, "Select a folder");
}

function testDrive() {
  const root = DriveApp.getRootFolder();
  Logger.log("Root folder: " + root.getName());
}

/**
 * A function that iterates through each document on the folder and determines where new folder
 * need to be created.
 * @param {string} folderId the folderId that is grabed by the client-side code.
 * @returns {string} the URL of the document to be edited.
 */
function getEachDocument(folderId) {
  const userResponse =
    PropertiesService.getUserProperties().getProperty("newFolderName") || "";

  const userFolder = DriveApp.getFolderById(folderId);
  const userFiles = userFolder.getFiles();
  let newFolder;

  if (userResponse === "") {
    newFolder = userFolder.createFolder(
      `${userFolder.getName()} Revised Copies`,
    );
  } else {
    newFolder = DriveApp.createFolder(userResponse);
  }

  while (userFiles.hasNext()) {
    const template = userFiles.next();
    const newDoc = DriveApp.getFileById(template.getId())
      .makeCopy()
      .moveTo(newFolder);
    placeHolderReplace(newDoc);
  }

  return newFolder.getUrl();
}

/**
 * The function that finds placeholders and replaces them with the values in the spreasheet.
 * @param document the URL that is passed by the previous function.
 */
function placeHolderReplace(document) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selection = sheet.getActiveRange();
  const keyValues = selection.getValues();
  Logger.log(keyValues);

  const userDoc = DocumentApp.openById(document.getId());

  const newDocBody = userDoc.getBody();

  const keyLength = keyValues.length;
  Logger.log(keyLength);

  for (let i = 0; i < keyLength; i++) {
    const escapedKey = keyValues[i][0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    newDocBody.replaceText(escapedKey, keyValues[i][1]);
  }
  userDoc.saveAndClose();
}
