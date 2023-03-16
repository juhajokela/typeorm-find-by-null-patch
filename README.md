# typeorm-find-by-null-patch

Patching/fixing the peculiar feature of TypeORM that returns data from database when querying with `id = null`, although there are no records with `id = null`. This feature is potentially dangerous in the perspective of security, as directly passing id from url returns records if id is not provided. This had to be fixed!

The beef is the getRepository function implementation in index.ts file. The rest of the file is just verifying the functioning of getRepository implementation (and producing the results below).

The patch is implemented by using public APIs of the TypeORM library to make it as proof as possible in future updates of the library by combining https://typeorm.io/custom-repository with https://typeorm.io/working-with-entity-manager

## Usage

```
npm i
npm start
```

## Results

```
*** builtinRepository ***
null find            [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000},{"id":"fad12b7a-fb9a-4ace-abf3-8efde49c3940","balance":250}]
null findBy          [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000},{"id":"fad12b7a-fb9a-4ace-abf3-8efde49c3940","balance":250}]
null findAndCount    [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000},{"id":"fad12b7a-fb9a-4ace-abf3-8efde49c3940","balance":250}],2]
null findAndCountBy  [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000},{"id":"fad12b7a-fb9a-4ace-abf3-8efde49c3940","balance":250}],2]
null findByIds       []
null findBy In       []
null findOne         {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
null findOneBy       {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
null findOneOrFail   {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
null findOneByOrFail {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
undefined find            [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000},{"id":"fad12b7a-fb9a-4ace-abf3-8efde49c3940","balance":250}]
undefined findBy          [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000},{"id":"fad12b7a-fb9a-4ace-abf3-8efde49c3940","balance":250}]
undefined findAndCount    [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000},{"id":"fad12b7a-fb9a-4ace-abf3-8efde49c3940","balance":250}],2]
undefined findAndCountBy  [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000},{"id":"fad12b7a-fb9a-4ace-abf3-8efde49c3940","balance":250}],2]
undefined findByIds       []
undefined findBy In       []
undefined findOne         {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
undefined findOneBy       {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
undefined findOneOrFail   {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
undefined findOneByOrFail {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
2331645c-15f0-4e1b-bd87-deb4bfdc6963 find            [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findBy          [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findAndCount    [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}],1]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findAndCountBy  [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}],1]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findByIds       [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findBy In       [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findOne         {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findOneBy       {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findOneOrFail   {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findOneByOrFail {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
[ null, undefined ] findByIds []
[ null, undefined ] findBy In []
```

```
*** customRepository ***
null find            []
null findBy          []
null findAndCount    [[],0]
null findAndCountBy  [[],0]
null findByIds       []
null findBy In       []
null findOne         null
null findOneBy       [[],0]
null findOneOrFail   EntityNotFoundError
null findOneByOrFail EntityNotFoundError
undefined find            []
undefined findBy          []
undefined findAndCount    [[],0]
undefined findAndCountBy  [[],0]
undefined findByIds       []
undefined findBy In       []
undefined findOne         null
undefined findOneBy       [[],0]
undefined findOneOrFail   EntityNotFoundError
undefined findOneByOrFail EntityNotFoundError
2331645c-15f0-4e1b-bd87-deb4bfdc6963 find            [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findBy          [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findAndCount    [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}],1]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findAndCountBy  [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}],1]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findByIds       [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findBy In       [{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findOne         {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findOneBy       [[{"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}],1]
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findOneOrFail   {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
2331645c-15f0-4e1b-bd87-deb4bfdc6963 findOneByOrFail {"id":"2331645c-15f0-4e1b-bd87-deb4bfdc6963","balance":1000}
[ null, undefined ] findByIds []
[ null, undefined ] findBy In []
```