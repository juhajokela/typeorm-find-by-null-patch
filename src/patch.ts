import { strict as assert } from 'node:assert'
import { IsNull } from "typeorm"

// quick & dirty SHALLOW copy, for better (preferably deep copy?) check lodash or something else
const copy = (obj) => ({ ...obj })

const isArray = (obj) =>  !!obj && obj.constructor === Array
const isObject = (obj) => !!obj && obj.constructor === Object

function mapValue(value) {
  if (value === null) {
    return IsNull()
  } else if (value === undefined) {
    return IsNull()
  } else if (isArray(value)) {
    return mapArray(value)
  } else if (isObject(value)) {
    return mapObject(value)
  }
  return value
}

const mapArray = array => array.map(x => mapValue(x))
const mapEntries = ([key, value]) => [key, mapValue(value)]
const mapObject = obj => Object.fromEntries(Object.entries(obj).map(mapEntries))

// https://typeorm.io/custom-repository
// https://github.com/typeorm/typeorm/blob/0.3.12/src/repository/Repository.ts#L523
// https://typeorm.io/working-with-entity-manager
// https://github.com/typeorm/typeorm/blob/0.3.12/src/entity-manager/EntityManager.ts#L1071

const getRepositoryProxy = (db) =>
  (entityClass) => db._getRepository(entityClass).extend({
    async find(options) {
      const opts = copy(options)
      opts.where = mapObject(options.where)
      return this.manager.find(entityClass, opts)
    },
    async findBy(where) {
      return this.manager.findBy(entityClass, mapObject(where))
    },
    async findAndCount(options) {
      const opts = copy(options)
      opts.where = mapObject(options.where)
      return this.manager.findAndCount(entityClass, opts)
    },
    async findAndCountBy(where) {
      return this.manager.findAndCountBy(entityClass, mapObject(where))
    },
    /*
    async findByIds(ids) {
      return this.manager.findByIds(entityClass, ids.map(mapNull))
    },
    */
    async findOne(options) {
      const opts = copy(options)
      opts.where = mapObject(options.where)
      return this.manager.findOne(entityClass, opts)
    },
    async findOneBy(where) {
      return this.manager.findAndCountBy(entityClass, mapObject(where))
    },
    /*
    async findOneById(id) {
      return this.manager.findOneById(entityClass, mapNull(id))
    },
    */
    async findOneOrFail(options) {
      const opts = copy(options)
      opts.where = mapObject(options.where)
      return this.manager.findOneOrFail(entityClass, opts)
    },
    async findOneByOrFail(where) {
      return this.manager.findOneByOrFail(entityClass, mapObject(where))
    }
  })

export function patch(db) {
  assert.strictEqual(db._getRepository, undefined)
  db._getRepository = db.getRepository
  db.getRepository = getRepositoryProxy(db)
}
