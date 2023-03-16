import "reflect-metadata"
import { Not, In } from "typeorm"
import { Account } from "./entity/Account"
import { db } from "./database"
import { patch } from "./patch"

async function createAccount(repository, balance: number) {
  const account = new Account()
  account.balance = balance
  await repository.save(account)
  return account.id
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
    const accountRepository = db.getRepository(Account)
    const accountOneId = await createAccount(accountRepository, 1000)
    const accountTwoId = await createAccount(accountRepository, 250)

    const ids = [null, undefined, accountOneId]

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
    patch(db)
    const betterAccountRepository = db.getRepository(Account)
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
