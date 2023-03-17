import { strict as assert } from 'node:assert'
import { IsNull } from "typeorm"
import style from './utils/terminalStyles'
import { _private } from './patch'
const { isArray, isObject, mapValue } = _private


function test(description, testFunc) {
  console.log('\n' + style(description, 'Bright', 'Underscore'))
  try {
    testFunc()
    console.log(style('OK!', 'FgGreen') + '\n')
  } catch (e) {
    console.error('\n' + style(e.toString(), 'FgRed') + '\n')
  }
}

test('test: isArray', () => {
  assert.strictEqual(isArray( undefined), false)
  assert.strictEqual(isArray(      null), false)
  assert.strictEqual(isArray(      true), false)
  assert.strictEqual(isArray(         1), false)
  assert.strictEqual(isArray(     'str'), false)
  assert.strictEqual(isArray(  new Date), false)
  assert.strictEqual(isArray(new Number), false)
  assert.strictEqual(isArray(        {}), false)
  assert.strictEqual(isArray(new Object), false)
  assert.strictEqual(isArray(        []), true)
  assert.strictEqual(isArray( new Array), true)
})

test('test: isObject', () => {
  assert.strictEqual(isObject( undefined), false)
  assert.strictEqual(isObject(      null), false)
  assert.strictEqual(isObject(      true), false)
  assert.strictEqual(isObject(         1), false)
  assert.strictEqual(isObject(     'str'), false)
  assert.strictEqual(isObject(  new Date), false)
  assert.strictEqual(isObject(new Number), false)
  assert.strictEqual(isObject(        []), false)
  assert.strictEqual(isObject( new Array), false)
  assert.strictEqual(isObject(        {}), true)
  assert.strictEqual(isObject(new Object), true)
})

test('test: mapValue', () => {
  assert.strictEqual(mapValue(undefined)._type, 'isNull')
  assert.strictEqual(mapValue(null)._type, 'isNull')
  assert.strictEqual(mapValue('...'), '...')
  assert.strictEqual(mapValue(123), 123)

  let result = mapValue([undefined, null, 123])
  assert.strictEqual(result.length, 3)
  assert.strictEqual(result[0]._type, 'isNull')
  assert.strictEqual(result[1]._type, 'isNull')
  assert.strictEqual(result[2], 123)

  result = mapValue({
    undefined: undefined,
    null: null,
    number: 123
  })
  assert.strictEqual(result.undefined._type, 'isNull')
  assert.strictEqual(result.null._type, 'isNull')
  assert.strictEqual(result.number, 123)
})
