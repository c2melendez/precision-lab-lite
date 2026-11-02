'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')

const merge = require('../index.js')

function parse (json) {
	return JSON.parse(json)
}

function assertNotPoisoned (value, label) {
	assert.equal(Object.getPrototypeOf(value), Object.prototype, label + ': prototype is Object.prototype')
	assert.equal(value.admin, undefined, label + ': no inherited admin')
	assert.equal(Object.hasOwn(value, 'admin'), false, label + ': no own admin')
}

test('variant 1: null-prototype target with a JSON __proto__ source', () => {
	const target = Object.create(null)
	const source = parse('{"__proto__":{"admin":true}}')
	const merged = merge(target, source)

	assertNotPoisoned(merged, 'variant 1')
	assert.equal(Object.hasOwn(merged, '__proto__'), false, 'no own __proto__ key')
	assert.equal(Object.keys(merged).length, 0, 'no enumerable keys leaked')
})

test('variant 2: null placeholder target with a nested JSON __proto__ source', () => {
	const target = { session: null }
	const source = parse('{"session":{"__proto__":{"admin":true}}}')
	const merged = merge(target, source)

	assertNotPoisoned(merged.session, 'variant 2')
	assert.deepEqual(Object.keys(merged.session), [], 'session has no keys')
})

test('variant 3: target that already owns a __proto__ key', () => {
	const target = parse('{"__proto__":{"legit":1},"keep":true}')
	const source = parse('{"__proto__":{"admin":true}}')
	const merged = merge(target, source)

	assertNotPoisoned(merged, 'variant 3')
	assert.equal(Object.hasOwn(merged, '__proto__'), false)
	assert.equal(merged.keep, true, 'legit keys still copied')
})

test('variant 4: constructor/prototype chain is dropped, not merged', () => {
	const merged = merge({}, parse('{"constructor":{"prototype":{"admin":true}}}'))

	assert.equal(merged.admin, undefined)
	assert.equal(Object.hasOwn(merged, 'constructor'), false)
	assert.equal(merged.constructor, Object, 'inherited constructor is untouched')
	assert.equal({}.admin, undefined, 'global Object.prototype untouched')
})

test('variant 4b: nested constructor/prototype input', () => {
	const merged = merge({ outer: {} }, parse('{"outer":{"constructor":{"prototype":{"admin":true}}}}'))

	assert.equal(merged.outer.admin, undefined)
	assert.equal(Object.hasOwn(merged.outer, 'constructor'), false)
	assert.equal(Object.getPrototypeOf(merged.outer), Object.prototype)
})

test('regression: ordinary deep merge is unchanged', () => {
	const merged = merge(
		{ a: 1, nested: { x: 1, keep: [1, 2] } },
		{ b: 2, nested: { y: 3, keep: [3] } }
	)

	assert.deepEqual(merged, { a: 1, b: 2, nested: { x: 1, y: 3, keep: [1, 2, 3] } })
	assert.equal(Object.getPrototypeOf(merged.nested), Object.prototype)
})

test('regression: arrays replace/concatenate as upstream documents', () => {
	assert.deepEqual(merge({ a: [1, 2] }, { a: [3] }), { a: [1, 2, 3] })
	assert.deepEqual(
		merge({ a: [1] }, { a: [2] }, { arrayMerge: (target, source) => source }),
		{ a: [2] }
	)
})

test('regression: clone false shares references', () => {
	const shared = { deep: { value: 1 } }
	const merged = merge({}, { shared }, { clone: false })
	assert.equal(merged.shared, shared)
})

test('regression: customMerge still receives the key', () => {
	const seen = []
	const merged = merge({ a: { v: 1 } }, { a: { v: 2 } }, {
		customMerge: (key) => {
			seen.push(key)
			return (target, source) => ({ v: target.v + source.v })
		}
	})
	assert.deepEqual(seen, ['a'])
	assert.deepEqual(merged, { a: { v: 3 } })
})

test('regression: merge.all folds left to right', () => {
	assert.deepEqual(merge.all([{ a: 1 }, { b: 2 }, { a: 3 }]), { a: 3, b: 2 })
	assert.throws(() => merge.all({}), /first argument should be an array/)
})

test('regression: symbol keys still merge', () => {
	const key = Symbol('k')
	const merged = merge({ [key]: 1 }, { [key]: 2 })
	assert.equal(merged[key], 2)
})

test('regression: Date and RegExp are treated as special values', () => {
	const date = new Date(0)
	const regexp = /x/
	const merged = merge({}, { date, regexp })
	assert.equal(merged.date, date)
	assert.equal(merged.regexp, regexp)
})

test('regression: a null-prototype target still merges normal keys', () => {
	const target = Object.create(null)
	target.a = 1
	const merged = merge(target, { b: 2 })
	assert.equal(merged.a, 1)
	assert.equal(merged.b, 2)
	assert.equal(Object.getPrototypeOf(merged), Object.prototype)
})
