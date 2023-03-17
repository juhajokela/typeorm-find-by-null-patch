# typeorm-find-by-null-patch

Patching/fixing the peculiar feature of TypeORM that returns data from database when querying with `id = null`, although there are no records with `id = null`. This feature is potentially dangerous in the perspective of security, as directly passing id from url returns records if id is not provided. This had to be fixed!

The beef is in the `patch.ts` file. The rest is just verifying the functioning of the patch (and producing the results below).

The patch is implemented by using public APIs of the TypeORM library to make it as proof as possible in future updates of the library by combining https://typeorm.io/custom-repository with https://typeorm.io/working-with-entity-manager

## Usage

```
npm i
npm start
```

## Results

```
*** builtinRepository ***
null find            [{"id":1},{"id":2}]
null findBy          [{"id":1},{"id":2}]
null findAndCount    [[{"id":1},{"id":2}],2]
null findAndCountBy  [[{"id":1},{"id":2}],2]
null findByIds       []
null findBy In       []
null findOne         {"id":1}
null findOneBy       {"id":1}
null findOneById     null
null findOneOrFail   {"id":1}
null findOneByOrFail {"id":1}

*** customRepository ***
null find            []
null findBy          []
null findAndCount    [[],0]
null findAndCountBy  [[],0]
null findByIds       []
null findBy In       []
null findOne         null
null findOneBy       [[],0]
null findOneById     null
null findOneOrFail   EntityNotFoundError
null findOneByOrFail EntityNotFoundError

*** builtinRepository ***
undefined find            [{"id":1},{"id":2}]
undefined findBy          [{"id":1},{"id":2}]
undefined findAndCount    [[{"id":1},{"id":2}],2]
undefined findAndCountBy  [[{"id":1},{"id":2}],2]
undefined findByIds       []
undefined findBy In       []
undefined findOne         {"id":1}
undefined findOneBy       {"id":1}
undefined findOneById     null
undefined findOneOrFail   {"id":1}
undefined findOneByOrFail {"id":1}

*** customRepository ***
undefined find            []
undefined findBy          []
undefined findAndCount    [[],0]
undefined findAndCountBy  [[],0]
undefined findByIds       []
undefined findBy In       []
undefined findOne         null
undefined findOneBy       [[],0]
undefined findOneById     null
undefined findOneOrFail   EntityNotFoundError
undefined findOneByOrFail EntityNotFoundError

*** builtinRepository ***
1 find            [{"id":1}]
1 findBy          [{"id":1}]
1 findAndCount    [[{"id":1}],1]
1 findAndCountBy  [[{"id":1}],1]
1 findByIds       [{"id":1}]
1 findBy In       [{"id":1}]
1 findOne         {"id":1}
1 findOneBy       {"id":1}
1 findOneById     {"id":1}
1 findOneOrFail   {"id":1}
1 findOneByOrFail {"id":1}

*** customRepository ***
1 find            [{"id":1}]
1 findBy          [{"id":1}]
1 findAndCount    [[{"id":1}],1]
1 findAndCountBy  [[{"id":1}],1]
1 findByIds       [{"id":1}]
1 findBy In       [{"id":1}]
1 findOne         {"id":1}
1 findOneBy       [[{"id":1}],1]
1 findOneById     {"id":1}
1 findOneOrFail   {"id":1}
1 findOneByOrFail {"id":1}

*** builtinRepository ***
[ null, undefined ] findByIds []
[ null, undefined ] findBy In []

*** customRepository ***
[ null, undefined ] findByIds []
[ null, undefined ] findBy In []

### RELATIONS ###

*** builtinRepository ***
null find            [{"id":1},{"id":2}]
null findBy          [{"id":1},{"id":2}]
null findAndCount    [[{"id":1},{"id":2}],2]
null findAndCountBy  [[{"id":1},{"id":2}],2]
null findOne         {"id":1}
null findOneBy       {"id":1}
null findOneOrFail   {"id":1}
null findOneByOrFail {"id":1}

*** customRepository ***
null find            []
null findBy          []
null findAndCount    [[],0]
null findAndCountBy  [[],0]
null findOne         null
null findOneBy       [[],0]
null findOneOrFail   EntityNotFoundError
null findOneByOrFail EntityNotFoundError

*** builtinRepository ***
undefined find            [{"id":1},{"id":2}]
undefined findBy          [{"id":1},{"id":2}]
undefined findAndCount    [[{"id":1},{"id":2}],2]
undefined findAndCountBy  [[{"id":1},{"id":2}],2]
undefined findOne         {"id":1}
undefined findOneBy       {"id":1}
undefined findOneOrFail   {"id":1}
undefined findOneByOrFail {"id":1}

*** customRepository ***
undefined find            []
undefined findBy          []
undefined findAndCount    [[],0]
undefined findAndCountBy  [[],0]
undefined findOne         null
undefined findOneBy       [[],0]
undefined findOneOrFail   EntityNotFoundError
undefined findOneByOrFail EntityNotFoundError

*** builtinRepository ***
1c0f5b79-240e-4b1c-b69c-3066306383bc find            [{"id":1}]
1c0f5b79-240e-4b1c-b69c-3066306383bc findBy          [{"id":1}]
1c0f5b79-240e-4b1c-b69c-3066306383bc findAndCount    [[{"id":1}],1]
1c0f5b79-240e-4b1c-b69c-3066306383bc findAndCountBy  [[{"id":1}],1]
1c0f5b79-240e-4b1c-b69c-3066306383bc findOne         {"id":1}
1c0f5b79-240e-4b1c-b69c-3066306383bc findOneBy       {"id":1}
1c0f5b79-240e-4b1c-b69c-3066306383bc findOneOrFail   {"id":1}
1c0f5b79-240e-4b1c-b69c-3066306383bc findOneByOrFail {"id":1}

*** customRepository ***
1c0f5b79-240e-4b1c-b69c-3066306383bc find            [{"id":1}]
1c0f5b79-240e-4b1c-b69c-3066306383bc findBy          [{"id":1}]
1c0f5b79-240e-4b1c-b69c-3066306383bc findAndCount    [[{"id":1}],1]
1c0f5b79-240e-4b1c-b69c-3066306383bc findAndCountBy  [[{"id":1}],1]
1c0f5b79-240e-4b1c-b69c-3066306383bc findOne         {"id":1}
1c0f5b79-240e-4b1c-b69c-3066306383bc findOneBy       [[{"id":1}],1]
1c0f5b79-240e-4b1c-b69c-3066306383bc findOneOrFail   {"id":1}
1c0f5b79-240e-4b1c-b69c-3066306383bc findOneByOrFail {"id":1}
```