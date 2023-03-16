import { IsNull } from "typeorm"

// quick & dirty SHALLOW copy, for better (preferably deep copy?) check lodash or something else
const copy = (obj) => ({ ...obj })

const mapNull = (value) => value == null || value === undefined ? IsNull() : value
const mapNullsInEntries = ([key, value]) => [key, mapNull(value)]
const mapNullsInObject = (obj) => Object.fromEntries(Object.entries(obj).map(mapNullsInEntries))

// https://typeorm.io/custom-repository
// https://github.com/typeorm/typeorm/blob/0.3.12/src/repository/Repository.ts#L523
// https://typeorm.io/working-with-entity-manager
// https://github.com/typeorm/typeorm/blob/0.3.12/src/entity-manager/EntityManager.ts#L1071

const getRepositoryProxy = (db) =>
  (entityClass) => db._getRepository(entityClass).extend({
    async find(options) {
      const opts = copy(options)
      opts.where = mapNullsInObject(options.where)
      return this.manager.find(entityClass, opts)
    },
    async findBy(where) {
      return this.manager.findBy(entityClass, mapNullsInObject(where))
    },
    async findAndCount(options) {
      const opts = copy(options)
      opts.where = mapNullsInObject(options.where)
      return this.manager.findAndCount(entityClass, opts)
    },
    async findAndCountBy(where) {
      return this.manager.findAndCountBy(entityClass, mapNullsInObject(where))
    },
    /*
    async findByIds(ids) {
      return this.manager.findByIds(entityClass, ids.map(mapNull))
    },
    */
    async findOne(options) {
      const opts = copy(options)
      opts.where = mapNullsInObject(options.where)
      return this.manager.findOne(entityClass, opts)
    },
    async findOneBy(where) {
      return this.manager.findAndCountBy(entityClass, mapNullsInObject(where))
    },
    async findOneById(id) {
      return this.manager.findOneById(entityClass, mapNull(id))
    },
    async findOneOrFail(options) {
      const opts = copy(options)
      opts.where = mapNullsInObject(options.where)
      return this.manager.findOneOrFail(entityClass, opts)
    },
    async findOneByOrFail(where) {
      return this.manager.findOneByOrFail(entityClass, mapNullsInObject(where))
    }
  })

export function patch(db) {
  db._getRepository = db.getRepository
  db.getRepository = getRepositoryProxy(db)
}
