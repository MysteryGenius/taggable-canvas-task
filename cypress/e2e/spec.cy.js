describe("The Main Page", () => {
  it("successfully loads", () => {
    cy.visit("/")
  })
})

describe("Image Upload", () => {
  it("clicks the upload button", () => {
    cy.get("#uploadButton").click()
    cy.get("#imageInput").attachFile("placeholder.jpg")

    cy.get("#uploadButton").click()
    cy.get("#imageInput").attachFile("placeholder.jpg")

    cy.get("#totalImages", { timeout: 10000 }).should("contain", "3")
  })
})

describe("Back button", () => {
  it("clicks the back button", () => {
    cy.get("#backButton").click()
    cy.get("#currImage", { timeout: 10000 }).should("contain", "2")
  })
  it("clicks the back button", () => {
    cy.get("#backButton").click()
    cy.get("#currImage", { timeout: 10000 }).should("contain", "1")
  })
  it("does not allow if at the start", () => {
    cy.get("#backButton").click()
    cy.get("#currImage", { timeout: 10000 }).should("contain", "1")
  })
})

describe("Next button", () => {
  it("clicks the next button", () => {
    cy.get("#nextButton").click()
    cy.get("#currImage", { timeout: 10000 }).should("contain", "2")
  })
  it("clicks the next button", () => {
    cy.get("#nextButton").click()
    cy.get("#currImage", { timeout: 10000 }).should("contain", "3")
  })
  it("does not allow if at the end", () => {
    cy.get("#nextButton").click()
    cy.get("#currImage", { timeout: 10000 }).should("contain", "3")
  })
})

describe("Image Delete", () => {
  it("clicks the delete button", () => {
    cy.get("#deleteButton").click()

    cy.get("#totalImages", { timeout: 10000 }).should("contain", "2")
  }).timeout(10000)
})

describe("Title", () => {
  it("enters a title", () => {
    cy.get("#imageTitle").click()
    cy.get("input[type=text]").clear().type("Test Title")
    cy.get("#clearAll").click()
    cy.get("#imageTitle").should("contain", "Test Title")
  })
})
