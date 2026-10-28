'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const merge = require('../index.js')

test('rejects __proto__ from a null-prototype target', () => {
  const target = Object.create(null)
  target.debug = false
  const source = JSON.parse('{"__proto__":{"isAdmin":true}}')
  const result = merge(target, source)
  assert.equal(Object.getPrototypeOf(result), Object.prototype)
  assert.equal(result.isAdmin, undefined)
  assert.equal(result.debug, false)
})

test('rejects __proto__ nested under a null placeholder', () => {
  const target = { session: null }
  const source = JSON.parse('{"session":{"__proto__":{"isAdmin":true}}}')
  const result = merge(target, source)
  assert.equal(Object.getPrototypeOf(result.session), Object.prototype)
  assert.equal(result.session.isAdmin, undefined)
})

test('does not copy an own __proto__ key from target', () => {
  const target = JSON.parse('{"__proto__":{"isAdmin":true},"debug":false}')
  const result = merge(target, { verbose: true })
  assert.equal(Object.getPrototypeOf(result), Object.prototype)
  assert.equal(result.isAdmin, undefined)
  assert.equal(Object.prototype.hasOwnProperty.call(result, '__proto__'), false)
  assert.equal(result.debug, false)
  assert.equal(result.verbose, true)
})

test('rejects __proto__ inside array elements during cloning', () => {
  const target = { list: [] }
  const source = JSON.parse('{"list":[{"__proto__":{"isAdmin":true}}]}')
  const result = merge(target, source)
  assert.equal(Object.getPrototypeOf(result.list[0]), Object.prototype)
  assert.equal(result.list[0].isAdmin, undefined)
})
