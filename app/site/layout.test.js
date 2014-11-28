require("expectations");
var _ = require("lodash");
var config = require("config3");
var pack = require("../../package");
var testUtils = require("app/testUtils");

describe("the main layout", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage("/", function(error, dom) {
      $ = dom;
      done(error);
    });
  });
  it("should have the google fonts", function() {
    var selector = "link[rel=stylesheet]";
    testUtils.assertSelectors($, selector);
    var hrefs = [];
    $(selector).each(function (index, item) {
      hrefs.push($(item).attr("href"));
    });
    expect(_.some(hrefs, function (href) {
      return href.indexOf("fonts.googleapis.com") >= 0;
    })).toBeTruthy();
  });

  it("should have the key structural elements", function() {
    testUtils.assertSelectors(
      $,"header h1", "body .content", "nav.site", ".license", "base[href='/']");
  });

  it("should have the normal title", function() {
    expect($("title").text()).toBe("Peter Lyons: node.js expert consultant");
  });

  it("should include the javascript with cachebusting", function() {
    testUtils.assertSelectors(
      $, "script[src='/browser.js?v=" + pack.version + "']");
  });
});

describe("analytics snippet", function () {
  before(function () {
    config.analytics.enabled = true;
    config.analytics.code = "UNIT_TEST";
  });

  after(function () {
    config.analytics.enabled = false;
    config.analytics.code = "";
  });

  it("should include the analytics snippet when enabled", function(done) {
    testUtils.loadPage("/", function (error, $) {
      var selector = "script[data-id=analytics]";
      testUtils.assertSelectors($, selector);
      expect($(selector).text()).toContain("UNIT_TEST");
      done();
    });
  });
});

describe("the site", function() {
  it("should have the CSS", function(done) {
    testUtils.get("/screen.css")
      .expect(200)
      .expect("Content-Type", "text/css; charset=utf-8")
      .end(done);
  });
});