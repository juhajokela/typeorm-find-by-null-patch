import "reflect-metadata"
import { IsNull, Not, In } from "typeorm"
import { Account } from "./entity/Account"
import { db } from "./database"

// quick and dirty SHALLOW copy, for better (preferably deep copy?) check lodash or something else
const copy = (obj) => ({ ...obj })

const mapNull = (value) => value == null || value === undefined ? IsNull() : value
const mapNullsInEntries = ([key, value]) => [key, mapNull(value)]
const mapNullsInObject = (obj) => Object.fromEntries(Object.entries(obj).map(mapNullsInEntries))

// https://typeorm.io/custom-repository
// https://github.com/typeorm/typeorm/blob/0.3.12/src/repository/Repository.ts#L523
// https://typeorm.io/working-with-entity-manager
// https://github.com/typeorm/typeorm/blob/0.3.12/src/entity-manager/EntityManager.ts#L1071
const getRepository = (entityClass) =>
  db.getRepository(entityClass).extend({
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

async function createAccount(repository, balance: number) {
  const account = new Account()
  account.balance = balance
  await repository.save(account)
  return account.id
}

db.initialize()
  .then(async () => {
    const accountRepository = db.getRepository(Account)
    const accountOneId = await createAccount(accountRepository, 1000)
    const accountTwoId = await createAccount(accountRepository, 250)

    const ids = [null, undefined, accountOneId]

    const output = async (x) => {
      try {
        return JSON.stringify(await x)
      } catch (e) {
        return e.name
      }
    }

    console.log('\n*** builtinRepository ***')
    for (let id of ids) {
      console.log(id, 'find           ', await output(accountRepository.find({where: {id: id}})))
      console.log(id, 'findBy         ', await output(accountRepository.findBy({id: id})))
      console.log(id, 'findAndCount   ', await output(accountRepository.findAndCount({where: {id: id}})))
      console.log(id, 'findAndCountBy ', await output(accountRepository.findAndCountBy({id: id})))
      console.log(id, 'findByIds      ', await output(accountRepository.findByIds([id])))
      console.log(id, 'findBy In      ', await output(accountRepository.findBy({id: In([id])})))
      console.log(id, 'findOne        ', await output(accountRepository.findOne({where: {id: id}})))
      console.log(id, 'findOneBy      ', await output(accountRepository.findOneBy({id: id})))
      console.log(id, 'findOneOrFail  ', await output(accountRepository.findOneOrFail({where: {id: id}})))
      console.log(id, 'findOneByOrFail', await output(accountRepository.findOneByOrFail({id: id})))
    }
    console.log([null, undefined], 'findByIds', await accountRepository.findByIds([null, undefined]))
    console.log([null, undefined], 'findBy In', await accountRepository.findBy({id: In([null, undefined])}))

    console.log('\n*** customRepository ***')
    const betterAccountRepository = getRepository(Account)
    for (let id of ids) {
      console.log(id, 'find           ', await output(betterAccountRepository.find({where: {id: id}})))
      console.log(id, 'findBy         ', await output(betterAccountRepository.findBy({id: id})))
      console.log(id, 'findAndCount   ', await output(betterAccountRepository.findAndCount({where: {id: id}})))
      console.log(id, 'findAndCountBy ', await output(betterAccountRepository.findAndCountBy({id: id})))
      console.log(id, 'findByIds      ', await output(betterAccountRepository.findByIds([id])))
      console.log(id, 'findBy In      ', await output(betterAccountRepository.findBy({id: In([id])})))
      console.log(id, 'findOne        ', await output(betterAccountRepository.findOne({where: {id: id}})))
      console.log(id, 'findOneBy      ', await output(betterAccountRepository.findOneBy({id: id})))
      console.log(id, 'findOneOrFail  ', await output(betterAccountRepository.findOneOrFail({where: {id: id}})))
      console.log(id, 'findOneByOrFail', await output(betterAccountRepository.findOneByOrFail({id: id})))
    }
    console.log([null, undefined], 'findByIds', await betterAccountRepository.findByIds([null, undefined]))
    console.log([null, undefined], 'findBy In', await betterAccountRepository.findBy({id: In([null, undefined])}))

  })
  .catch((error) => console.log(error));
