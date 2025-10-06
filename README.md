#### Тестовое задание REST API на NestJs

Основной стек:
- Node.js + NestJS
- PostgreSQL
- TypeORM
- Redis
- JWT
- Docker + Docker Compose

##### Структура проекта
```
src
├── app.module.ts
├── auth                         #Модуль для авторизации/регистрации пользователя
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.repository.ts
│   ├── auth.service.ts
│   ├── dto
│   │   └── auth.dto.ts
│   ├── guard                     #Middleware для проверки токена
│   │   └── auth.guard.ts
│   ├── jwt
│   │   └── jwt.config.ts
│   └── types
│       └── index.ts
├── database                      #Настройки для подключения к postgres
│   ├── database.config.ts
│   ├── database.module.ts
│   ├── migrations
│   │   └── index.ts
│   ├── models                    #Сущности БД   
│   │   ├── posts.models.ts
│   │   └── user.model.ts
│   └── typeorm.ts
├── main.ts
├── post                           #Модуль для постов   
│   ├── dto
│   │   ├── post-validator.dto.ts
│   │   └── post.dto.ts
│   ├── post.controller.ts
│   ├── post.module.ts
│   ├── post.repository.ts
│   ├── post.service.ts
│   └── types
│       └── index.ts
├── redis.                         #Настройки для подключения к redis                  
│   ├── redis.config.ts
│   ├── redis.module.ts
│   └── redis.service.ts
├── tests                          #Unit тесты
│   ├── auth.test.ts
│   └── post.test.ts
└── utils                          #Различные хелперы, которые используются в проекте                      
    ├── constants.ts
    ├── filter-helper.ts
    └── helpers.ts
```



Для запуска приложение необходимо

```Bash
docker compose up -d
```
Эта команда поднимет как api, так и базы данных (redis, postgres)

Все API методы можно посмотреть в сваггере [здесь](http://localhost:3000/docs), так же они описаны ниже API методы:

## Аутентификация

Используется **JWT**

### Эндпоинты

#### POST `/auth/register`

Создание нового пользователя.

**Request:**

``` json
{
  "login": "admin",
  "password": "secret123"
}
```

**Response:**

``` json
{
  "userId": "3c16d961-4429-494d-b744-dc825e24f5c3",
  "login": "admin",
  "createdAt": "2025-10-02"
}
```

------------------------------------------------------------------------

#### POST `/auth/login`

Аутентификация и получение токена.

**Request:**

``` json
{
  "login": "admin",
  "password": "secret123"
}
```

**Response:**

``` json
{
  "userId": "userId",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR.."
}
```

Токен передаётся в заголовках:

    Authorization: Bearer <token>

------------------------------------------------------------------------

## CRUD API для статей (`/posts`)

  Метод      Путь           Описание                                   Авторизация
  ---------- -------------- ------------------------------------------ --------------
  `POST`     `/posts/create`       Создать статью                      требуется
  `GET`      `/posts`       Получить список с пагинацией и фильтрами   требуется
  `GET`      `/posts/:id`   Получить одну статью                       требуется
  `PATCH`    `/posts/:id`   Обновить статью                            требуется
  `DELETE`   `/posts/:id`   Удалить статью                             требуется

------------------------------------------------------------------------

### Пример создания статьи

**POST /posts/create**

``` json
{
  "name": "My first article",
  "description": "Some text about the article"
}
```

**Response:**

``` json
{
  "postId": "ec6fcd4f-448b-49f3-9e31-9b07362cd039",
  "name": "My first article",
  "description": "Some text about the article",
  "createdAt": "2025-10-02T18:03:48.935Z",
  "user": {
    "userId": "3c16d961-4429-494d-b744-dc825e24f5c3",
    "login": "admin"
  }
}
```

------------------------------------------------------------------------

### Фильтрация и пагинация

**GET /posts?skip=0&limit=15&name[neq]=test post**

Доступны фильтры: `eq` | `neq` | `gt` | `gte` | `lt` | `lte` | `like` | `nlike` | `in` | `nin` | `isnull` | `isnotnull`
Фильтры доступны по всем полям, если нужно найти автора статьи,то URL будет выглядить так:

**GET /posts?skip=0&limit=15&user.name[neq]=admin&sortField=createdAt&sortOrder=asc**

Параметры:

| Параметр    |Описание |
|-------------|---------------------------------------------|  
| `name`      | фильтр по названию статьи (как пример).     |
| `skip`      | количество элементов для пропуска           |
| `limit`     | количество элементов                        |
| `sortField` | Поле по которому данные будут сортироваться |
| `sortOrder` | Порядок сортировки ( `ASC` or `DESC`)       |



## Кэширование (Redis)

-   При `GET /posts` результат кэшируется в Redis.
-   При `PATCH`, `DELETE` --- кэш **инвалидируется**
    (удаляется).

