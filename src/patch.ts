import { strict as assert } from 'node:assert'
import {
  EntityTarget,
  ObjectLiteral,
  IsNull,
  FindManyOptions,
  FindOptionsWhere,
  FindOneOptions,
  DataSource,
} from "typeorm"

interface PatchedDataSource extends DataSource {
  _getRepository?: DataSource['getRepository']
}

// quick & dirty SHALLOW copy, for better (preferably deep copy?) check lodash or something else
const copy = (obj: Object) => ({ ...obj })

const isArray = (obj: any) =>  !!obj && obj.constructor === Array
const isObject = (obj: any) => !!obj && obj.constructor === Object

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

const mapArray = (array: any[]): any[] => array.map((x) => mapValue(x))
const mapEntries = ([key, value]: [string, any]): [string, any] => [key, mapValue(value)]
const mapObject = (obj: Object): Object => Object.fromEntries(Object.entries(obj).map(mapEntries))

// https://typeorm.io/custom-repository
// https://github.com/typeorm/typeorm/blob/0.3.12/src/repository/Repository.ts#L523
// https://typeorm.io/working-with-entity-manager
// https://github.com/typeorm/typeorm/blob/0.3.12/src/entity-manager/EntityManager.ts#L1071

const getRepositoryProxy = (db: PatchedDataSource) =>
  <Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>) =>
    db._getRepository(entityClass).extend({
      async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
        const opts = copy(options) as FindManyOptions<Entity>
        opts.where = mapObject(options.where) as FindOptionsWhere<Entity>
        return this.manager.find(entityClass, opts)
      },
      async findBy(
        where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
      ): Promise<Entity[]> {
        return this.manager.findBy(entityClass, mapObject(where))
      },
      findAndCount(
        options?: FindManyOptions<Entity>,
      ): Promise<[Entity[], number]> {
        const opts = copy(options) as FindManyOptions<Entity>
        opts.where = mapObject(options.where) as FindOptionsWhere<Entity>
        return this.manager.findAndCount(entityClass, opts)
      },
      findAndCountBy(
        where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    ): Promise<[Entity[], number]> {
        return this.manager.findAndCountBy(entityClass, mapObject(where))
      },
      /*
      async findByIds(ids: any[]): Promise<Entity[]> {
        return this.manager.findByIds(entityClass, ids.map(mapNull))
      },
      */
      async findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
        const opts = copy(options) as FindManyOptions<Entity>
        opts.where = mapObject(options.where) as FindOptionsWhere<Entity>
        return this.manager.findOne(entityClass, opts)
      },
      async findOneBy(
        where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
      ): Promise<Entity | null> {
        return this.manager.findOneBy(entityClass, mapObject(where))
      },
      /*
      async findOneById(
          id: number | string | Date | ObjectID,
      ): Promise<Entity | null> {
        return this.manager.findOneById(entityClass, mapNull(id))
      },
      */
      async findOneOrFail(options: FindOneOptions<Entity>): Promise<Entity> {
        const opts = copy(options) as FindManyOptions<Entity>
        opts.where = mapObject(options.where) as FindOptionsWhere<Entity>
        return this.manager.findOneOrFail(entityClass, opts)
      },
      async findOneByOrFail(
        where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
      ): Promise<Entity> {
        return this.manager.findOneByOrFail(entityClass, mapObject(where))
      }
    })

export default function patch(db: PatchedDataSource) {
  assert.strictEqual(db._getRepository, undefined)
  db._getRepository = db.getRepository
  db.getRepository = getRepositoryProxy(db)
}

// only for testing
export const _private = {
  isArray,
  isObject,
  mapValue,
}
