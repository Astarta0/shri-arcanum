# arcanum

#### DEPENDENCES
 - node v12.6.0+

#### Запуск в режиме разработки
```
бекенд: node index.js -p PATH
фронтенд: npm run webpack
```

#### Сборка
`npm run build`

Используются:
- [ExpressJS](https://expressjs.com)
- [React](https://reactjs.org/)
- [React-Router](https://github.com/ReactTraining/react-router)
- [Redux](https://redux.js.org)
- [Webpack](https://webpack.js.org)
- [Babel и плагины](https://babeljs.io)
- [PostCSS](https://postcss.org)
- [ESLint](https://eslint.org)
- и др.

#### Notes
- [ ] Проект делался без использования шаблонов, типа `create-react-app`.
- [ ] Сделан SSR
- [ ] При переходе по BreadCrumb'aм - в адресной строке менется url, обновление данных происходит без перезагрузки страницы
- [ ] При обновлении или прямом заходе по URL мы должны попадать в тот же файл или директорию (срабатывает SSR, где происходит предварительный сбор данных)
- [ ] Изначально хотелось использовать css-modules, настройки для них я оставила закомментированными, но времени менять использование стилей в jsx особо нет, поэтому оставила на будущие переделки. 

### Тесты: Начальное состояние

Так как приложение отображает состояние папки с репозиториями на вашей локальной машине,
для тестов важно, чтобы в папке были репозитории, информация по которым ипользовалась
во время тестов. Поэтому перед запуском тестов важно добавить через API приложения
два репозитория, которые я использовала во время написания тестов.
- https://github.com/gaearon/subliminal
- https://github.com/gaearon/todos

:exclamation: Такая зависимость от файловой системы для тестов крайне нежелательна, но так как
время на задание сильно ограничено, то автоматизировать эту часть я не успела.

Поэтому перед запуском тестов, необходимо вручную очистить содержимое вашей папки
с репозиториями и склонировать туда через апи выше указанные репозитории:
```
# Первый
curl -i -X POST \
    -H "Content-Type: application/json" \
    -d '{"url": "https://github.com/gaearon/subliminal.git"}' \
    http://localhost:3000/api/repos/subliminal

# Второй
curl -i -X POST \
    -H "Content-Type: application/json" \
    -d '{"url": "https://github.com/gaearon/todos.git"}' \
    http://localhost:3000/api/repos/todos
```

Либо напрямую через `git clone`:
```
cd $YOUR_REPOS_PATH
git clone https://github.com/gaearon/subliminal.git
git clone https://github.com/gaearon/todos.git
```

### Модульные тесты

Я покрыла модульными тестами два логических блока моего приложения:
- `HTTP` слой, который включает в себя обработку запросов с помощью `expressjs`. 
То как мы принимаем `HTTP` запросы и что отдаем в ответ.
- Слой по работе с `git` (`gitUtils.js`). Модуль из более низкоуровневых операций.

Для тестирования `HTTP` слоя были замоканы зависимости от `gitUtils` и `fs` модулей.
Для тестирования `gitUtils` были замоканы `fs` и `child_process` модули.

В качестве моков я использовала [встроенный функционал от jest](https://jestjs.io/docs/ru/mock-functions#mocking-modules). 

### Интеграционные тесты

Интеграционные тесты реализованы с помощью [hermione](https://github.com/gemini-testing/hermione).

#### Установка

Предварительно требуется установить selenium на вашу локальную машину.

```
# Устанавливаем селениум
npm install selenium-standalone --global
selenium-standalone install

# Ставим java, если нет
brew cask install java
```

#### Запуск

```
# Запускаем селениум
selenium-standalone start

# Запускаем тесты
npm run hermione

# Смотрим отчет
npm run hermione:gui
```

:exclamation: Скриншоты для тестов делались на пк с Rétina дисплеем. Это влияет на размер скриншота и на их сравнение в тестах.
