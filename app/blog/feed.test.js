var expect = require('chaimel')
var testBlog = require('./test-blog')

describe('a blog feed XML', function () {
  var $ = null
  before(function (done) {
    testBlog.loadPage('/utb/feed', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have an atom XML feed tag', function () {
    expect($('feed').length).toEqual(1)
  })

  it('should have the right feed > title content', function () {
    expect($('feed > title').text()).toEqual('Unit Test Blog 1')
  })

  it('should have 10 recent posts', function () {
    expect($('entry').length).toEqual(10)
  })

  it('should have the author', function () {
    expect($('author > name').text()).toEqual('Peter Lyons')
  })

  it('should have the self ref link', function () {
    expect($('link[rel="self"]').attr('href'))
      .toEqual('http://127.0.0.1/utb/feed')
  })
})
