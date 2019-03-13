const Nightmare = require("nightmare");
const assert = require("assert");
const url = "http://localhost:3090/";

describe("single user testing", function() {
  let nightmare = null;
  this.timeout("30s");

  beforeEach(async () => {
    nightmare = new Nightmare({ show: false, x: 0, y: 0 });
    await nightmare.viewport(600, 100);
  });

  it("should load entire page", async () => {
    const title = await nightmare
      .goto(url)
      .wait()
      .evaluate(() => document.querySelector(".boydoglabs-link").innerText);

    assert(title.length);

    await nightmare.end();
  });

  it("should load changes from server", async () => {
    await nightmare
      .goto(url + "testScopeChangeFromServer")
      .wait()
      .goto(url);
    const a = nightmare.evaluate(() => {
      document.querySelector('input[dog-value="word"]').value;
    });
    const b = nightmare.evaluate(() => {
      document.querySelector('input[dog-value="title"]').value;
    });
    const c = nightmare.evaluate(() => {
      document.querySelector('input[dog-value="subject"]').value;
    });

    assert(a === "Changes");
    assert(b === "From");
    assert(c === "Server");

    await nightmare.end();
  });
});

describe("simultaneous user testing", function() {
  let nightmare = null;
  this.timeout("30s");

  beforeEach(() => {
    nightmareA = new Nightmare({ show: false, x: 0, y: 0 });
    nightmareB = new Nightmare({ show: false, x: 600, y: 0 });

    nightmareA
      .viewport(600, 100)
      .goto(url)
      .wait();

    nightmareB
      .viewport(600, 100)
      .goto(url)
      .wait();
  });

  //TODO: Make async/await
  it("should collaborate on 2 dog-value's", done => {
    nightmareA
      .click('input[dog-value="word"]')
      .type(
        'input[dog-value="word"]',
        "\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008"
      ) //Backspace
      .type(
        'input[dog-value="word"]',
        "\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F"
      ) //Delete
      .type('input[dog-value="word"]', "user A editing here")
      .end()
      .catch(done);

    nightmareB
      .click('input[dog-value="subject"]')
      .type(
        'input[dog-value="subject"]',
        "\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008"
      ) //Backspace
      .type(
        'input[dog-value="subject"]',
        "\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F"
      ) //Delete
      .type('input[dog-value="subject"]', "user B editing here")
      .wait(1000)
      .evaluate(() => {
        let a = document.querySelector('input[dog-value="word"]').value;
        let b = document.querySelector('input[dog-value="subject"]').value;

        chai.assert(a === "user A editing here");
        chai.assert(b === "user B editing here");
      })
      .end()
      .then(() => {
        done();
      })
      .catch(done);
  });

  //TODO: Make async/await
  it("should update a parent dog-value", done => {
    nightmareA
      .click('input[dog-value="data>name"]')
      .type(
        'input[dog-value="data>name"]',
        "\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008"
      ) //Backspace
      .type(
        'input[dog-value="data>name"]',
        "\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F"
      ) //Delete
      .type('input[dog-value="data>name"]', "first")
      .end()
      .catch(done);

    nightmareB
      .click('input[dog-value="data>address"]')
      .type(
        'input[dog-value="data>address"]',
        "\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008"
      ) //Backspace
      .type(
        'input[dog-value="data>address"]',
        "\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F\u007F"
      ) //Delete
      .type('input[dog-value="data>address"]', "second")
      .wait(1000)
      .evaluate(() => {
        let a = document.querySelector('input[dog-value="data"]').value;
        let b = document.querySelector('input[dog-value="data>name"]').value;
        let c = document.querySelector('input[dog-value="data>address"]').value;

        chai.assert.include(a, b);
        chai.assert.include(a, c);
      })
      .end()
      .then(() => {
        done();
      })
      .catch(done);
  });
});
