import "reflect-metadata"
import { Not, In } from "typeorm"
import { Account, Transaction } from "./models/models"
import { db } from "./database"
import { patch } from "./patch"

async function createAccount(db): Promise<[number, string, string]> {
  const tx1 = new Transaction()
  tx1.data = "$20 from Alice to Bob"
  await db.getRepository(Transaction).save(tx1)

  const tx2 = new Transaction()
  tx2.data = "$70 from Alice to Bob"
  await db.getRepository(Transaction).save(tx2)

  const account = new Account()
  account.transactions = [tx1, tx2]
  await db.getRepository(Account).save(account)

  return [
    account.id,
    tx1.id,
    tx2.id,
  ]
}

const output = async (x) => {
  try {
    return JSON.stringify(await x)
  } catch (e) {
    return e.name
  }
}

db.initialize()
  .then(async () => {
    const [accountOneId, tx11id, tx12id] = await createAccount(db)
    const [accountTwoId, tx21id, tx22id] = await createAccount(db)

    const accountRepository = db.getRepository(Account)
    patch(db)
    const betterAccountRepository = db.getRepository(Account)

    for (let id of [null, undefined, accountOneId]) {
      console.log('\n*** builtinRepository ***')
      console.log(id, 'find           ', await output(accountRepository.find({where: {id: id}})))
      console.log(id, 'findBy         ', await output(accountRepository.findBy({id: id})))
      console.log(id, 'findAndCount   ', await output(accountRepository.findAndCount({where: {id: id}})))
      console.log(id, 'findAndCountBy ', await output(accountRepository.findAndCountBy({id: id})))
      console.log(id, 'findByIds      ', await output(accountRepository.findByIds([id])))
      console.log(id, 'findBy In      ', await output(accountRepository.findBy({id: In([id])})))
      console.log(id, 'findOne        ', await output(accountRepository.findOne({where: {id: id}})))
      console.log(id, 'findOneBy      ', await output(accountRepository.findOneBy({id: id})))
      console.log(id, 'findOneById    ', await output(accountRepository.findOneById(id)))
      console.log(id, 'findOneOrFail  ', await output(accountRepository.findOneOrFail({where: {id: id}})))
      console.log(id, 'findOneByOrFail', await output(accountRepository.findOneByOrFail({id: id})))

      console.log('\n*** customRepository ***')
      console.log(id, 'find           ', await output(betterAccountRepository.find({where: {id: id}})))
      console.log(id, 'findBy         ', await output(betterAccountRepository.findBy({id: id})))
      console.log(id, 'findAndCount   ', await output(betterAccountRepository.findAndCount({where: {id: id}})))
      console.log(id, 'findAndCountBy ', await output(betterAccountRepository.findAndCountBy({id: id})))
      console.log(id, 'findByIds      ', await output(betterAccountRepository.findByIds([id])))
      console.log(id, 'findBy In      ', await output(betterAccountRepository.findBy({id: In([id])})))
      console.log(id, 'findOne        ', await output(betterAccountRepository.findOne({where: {id: id}})))
      console.log(id, 'findOneBy      ', await output(betterAccountRepository.findOneBy({id: id})))
      console.log(id, 'findOneById    ', await output(betterAccountRepository.findOneById(id)))
      console.log(id, 'findOneOrFail  ', await output(betterAccountRepository.findOneOrFail({where: {id: id}})))
      console.log(id, 'findOneByOrFail', await output(betterAccountRepository.findOneByOrFail({id: id})))
    }

    console.log('\n*** builtinRepository ***')
    console.log([null, undefined], 'findByIds', await accountRepository.findByIds([null, undefined]))
    console.log([null, undefined], 'findBy In', await accountRepository.findBy({id: In([null, undefined])}))

    console.log('\n*** customRepository ***')
    console.log([null, undefined], 'findByIds', await betterAccountRepository.findByIds([null, undefined]))
    console.log([null, undefined], 'findBy In', await betterAccountRepository.findBy({id: In([null, undefined])}))

    console.log('\n### RELATIONS ###')

    for (let id of [null, undefined, tx11id]) {
      let where = {transactions: {id: id}}
      let options = {where: {transactions: {id: id}}}
      console.log('\n*** builtinRepository ***')
      console.log(id, 'find           ', await output(accountRepository.find(options)))
      console.log(id, 'findBy         ', await output(accountRepository.findBy(where)))
      console.log(id, 'findAndCount   ', await output(accountRepository.findAndCount(options)))
      console.log(id, 'findAndCountBy ', await output(accountRepository.findAndCountBy(where)))
      console.log(id, 'findOne        ', await output(accountRepository.findOne(options)))
      console.log(id, 'findOneBy      ', await output(accountRepository.findOneBy(where)))
      console.log(id, 'findOneOrFail  ', await output(accountRepository.findOneOrFail(options)))
      console.log(id, 'findOneByOrFail', await output(accountRepository.findOneByOrFail(where)))

      console.log('\n*** customRepository ***')
      console.log(id, 'find           ', await output(betterAccountRepository.find(options)))
      console.log(id, 'findBy         ', await output(betterAccountRepository.findBy(where)))
      console.log(id, 'findAndCount   ', await output(betterAccountRepository.findAndCount(options)))
      console.log(id, 'findAndCountBy ', await output(betterAccountRepository.findAndCountBy(where)))
      console.log(id, 'findOne        ', await output(betterAccountRepository.findOne(options)))
      console.log(id, 'findOneBy      ', await output(betterAccountRepository.findOneBy(where)))
      console.log(id, 'findOneOrFail  ', await output(betterAccountRepository.findOneOrFail(options)))
      console.log(id, 'findOneByOrFail', await output(betterAccountRepository.findOneByOrFail(where)))
    }
  })
  .catch((error) => console.log(error));
