describe("ImageKit Next SDK", () => {
  const APP_HOST = Cypress.env().APP_HOST;

  describe("Lazyload", () => {
    it("should have empty src before reaching lazyload threshold", () => {
      cy.visit(APP_HOST);

      cy.get(".lazyload").should("not.have.attr", "src");
    });

    it("should have actual src after reaching lazyload threshold", () => {
      cy.visit(APP_HOST);

      cy.get(".lazyload").scrollIntoView();

      cy.wait(500);

      cy.get(".lazyload").should("have.attr", "src").and("include", "tr:h-200,w-200/default-image.jpg");
    });
  });

  describe("Lazyload with LQIP", () => {
    it("should have lqip src before reaching threshold", () => {
      cy.visit(APP_HOST);

      cy.get(".lazyload-lqip").should("not.have.attr", "src");
    });

    it("should have actual src after reaching element", () => {
      cy.visit(APP_HOST);

      cy.get(".lazyload-lqip").scrollIntoView();

      cy.wait(1000);

      cy.get(".lazyload-lqip").should("have.attr", "src").and("include", "tr:h-200,w-200/default-image.jpg");
    });
  });

  describe("LQIP", () => {
    // unable to test this because actual image load always finishes too quickly
    it.skip("should have lqip src before image is loaded", () => {
      cy.visit(APP_HOST);

      cy.get(".lqip").should("have.attr", "src").and("include", "tr:h-200,w-200:q-20,bl-10/default-image.jpg");
    });

    it("should have actual src after image is loaded", () => {
      cy.visit(APP_HOST);

      cy.get(".lqip").scrollIntoView();

      cy.wait(500);

      cy.get(".lqip").should("have.attr", "src").and("include", "tr:h-200,w-200/default-image.jpg");
    });
  });

  describe("State update check", () => {
    it("should update image src with chained transformation outside ImageKitProvider dynamically", () => {
      cy.visit(APP_HOST);

      cy.get(".img-transformation-direct").scrollIntoView();

      cy.wait(500);

      cy.get(".img-transformation-direct").should("have.attr", "src").and("include", "tr:h-300,w-300/default-image.jpg");

      cy.get(".btn-to-change-tr-direct").click();
      cy.wait(500);

      cy.get(".img-transformation-direct").should("have.attr", "src").and("include", "tr:h-200,w-600,r-max:h-200,w-200,rt-180/default-image.jpg");
    });
    it("should update image src within ImageKitProvider when button is clicked", () => {
      cy.visit(APP_HOST);

      cy.get(".img-transformation").scrollIntoView();

      cy.wait(500);

      cy.get(".img-transformation").should("have.attr", "src").and("include", "tr:h-200,w-200/default-image.jpg");

      cy.get(".btn-to-change-tr").click();
      cy.wait(500);

      cy.get(".img-transformation").should("have.attr", "src").and("include", "tr:h-200,w-200,r-max/default-image.jpg");
    });
  });

  describe("Height Width and Quality handling check", () => {
    it("If height, width, or quality is specified only as a prop and not in the transformation, it is automatically applied in the transformation", () => {
      cy.visit(APP_HOST);

      cy.get(".applied-to-transformation").scrollIntoView();

      cy.wait(500);

      cy.get(".applied-to-transformation").should("have.attr", "src").and("include", "tr:h-200,w-200,q-10/default-image.jpg");
    });
    it("Height and width properties are ignored if they are included in the transformation", () => {
      cy.visit(APP_HOST);

      cy.get(".img-transformation-direct").scrollIntoView();

      cy.wait(500);

      cy.get(".img-transformation-direct").should("have.attr", "src").and("include", "tr:h-300,w-300/default-image.jpg");
      cy.get(".img-transformation-direct").should("not.have.attr", "height");
      cy.get(".img-transformation-direct").should("not.have.attr", "width");
    });
  });
});
