var humanize = require('./lib/humanize');
var storage = require('./lib/storage');
var renderContent = require('./lib/renderContent');

describe("humanize", () => {
    it("formats the date", done => {
        if (humanize.prettyDate('2017-03-28T13:42:09.3233868') !== "2017-03-28 13:42") return done("format is incorrect");

        done();
    });

    it("displays a timespan", done => {
        if (humanize(new Date()) !== "0 seconds") return done("format is incorrect");

        done();
    });
});

describe("storage", () => {
    it("polyfills localstorage", done => {
        
        if (storage.get("foo")) return done("expected null")
        
        storage.put("foo", "bar");
        
        if ("bar" !== storage.get("foo")) return done("expected bar")
               
        storage.del("foo");
        
        if (storage.get("foo")) return done("expected value to be deleted");
        
        done();
    });
});

describe("renderContent", ()=> {
    it("renders markdown", done => {
        var content = renderContent("# Hello World");
        if ('<h1 id="hello-world">Hello World</h1>\n' !== content) return done(`content not rendered correctly (${content})`);
        
        done();
    });

    it("renders emoji", done => {
        var content = renderContent(":sparkles:");
        if ("<p>✨</p>\n" !== content) return done(`content not rendered correctly (${content})`);
        
        done();
    });

});

