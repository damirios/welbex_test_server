# Тестовое задание для Welbex
## Blog API

### Задание
Приложение представляет собой страницу, на которой могут делать записи любые авторизованные пользователи.

* Необходимо реализовать регистрацию и авторизацию пользователя, а также проверку JWT-токена при внесении записей на страницу - 
[controller](https://github.com/damirios/welbex_test_server/blob/main/controllers/user_controller.js),
[model](https://github.com/damirios/welbex_test_server/blob/main/models/user_model.js),
[service](https://github.com/damirios/welbex_test_server/blob/main/service/user_service.js).
* Запись блога содержит:<br>
    --- Дата записи<br>
    --- Сообщение: может содержать как текст, так и медиа<br>
    --- Автор сообщения<br>
* На странице с записями должна быть реализована пагинация, на каждой странице (пагинации) должно отображаться по 20 записей
* Автор записи может редактировать или удалять запись
* Базу данных необходимо заполнить стартовыми записями
* Необходимо выполнить деплой сервера для публичного доступа
* Необходимо написать документацию к эндпоинтам (вручную или сгенерировать из кода)

### Решение
Корневой рут Blog API (деплой-версия): https://welbextestserver-production.up.railway.app

Документация с помощью Swagger: https://welbextestserver-production.up.railway.app/api-doc

Документация ручная:

Руты:
1. https://welbextestserver-production.up.railway.app/api/messages
* post - публикация нового сообщения (требуется авторизация)<br>
-- параметры: {date: string, text: string}
* get - получение списка сообщений (возможно уточнение страницы (пагинация) - query-параметр)
2. https://welbextestserver-production.up.railway.app/api/messages/{id}<br>
-- параметр id - уникальный идентификатор сообщения
* put - изменение сообщения (доступно только автору сообщения)<br>
-- параметры: {date: string, text: string}
* delete - удаление сообщения (доступно только автору сообщения)
3. https://welbextestserver-production.up.railway.app/api/users
* get - получение списка пользователей
4. https://welbextestserver-production.up.railway.app/api/users/signup
* post - регистрация нового пользователя<br>
-- параметры: {email: string, password: string}
5. https://welbextestserver-production.up.railway.app/api/users/login
* post - авторизация пользователя<br>
-- параметры: {email: string, password: string}
6. https://welbextestserver-production.up.railway.app/api/users/logout
* post - выход пользователя из аккаунта (unathorization)
7. https://welbextestserver-production.up.railway.app/api/users/refresh
* get - обновление refresh токена (и access токена тоже).
--- примечание: обновление токена требуется, если истекло время жизни access токена, но не истекло время жизни refresh токена.<br>
Тогда из куков достаётся refresh токен, и, если он совпадает с токеном, хранящимся в БД, то генерируем новые токены и авторизуем пользователя
8. https://welbextestserver-production.up.railway.app/api/users/activate/{activationLink}<br>
-- параметр activationLink - уникальая ссылка активации, сгенерированная для нового пользователя. Нужна для активации аккаунта (в данном случае ни на что не влияет)
9. https://welbextestserver-production.up.railway.app/
* Корневой рут - сразу переадресует на https://welbextestserver-production.up.railway.app/api/messages
