# arcanum

#### DEPENDENCES
 - node v12.6.0+

#### Запуск в режиме разработки
```
бекенд: node index.js -p PATH
фронтенд: npm run webpack
```

Места, вызвавшие трудности, при переводе на TS:
1. Типизация redux actions
2. Типизация обработчиков на document

Найденные ошибки при переводе на TS
1.  В INITIAL_STATE редьюсера отсутствовало поле currentBranch, но в интерфейсе значение всегда
было и все работало т.к. оно проставлялось SSR при сбьоре данных и формировании стейта
2. Ошибки установок зависимостей, например, react-highlight была в devDependences
3. Неверное именование пропсов внутри одного компонента - опечатки
4. Не передан пропс дочернему компоненту

Что не понравилось:
1. Пришлось отказаться от декораторов
2. Иногда добавлять доп.условия в уже работающие функции: 
легче сразу писать на ts, чтобы потом не надо было решать таких задачек, когда функция работает,
а из-за несоответствия типов приходится добавлять какие-то условия
3. Если в ts файл импортится что-то из .js файла - не находит - надо переименовать тот js файл. Выходит не совсем верно утверждение,
что можно постепенно переводить проект на ts

``We invest in TypeScript (or any other static type-checker) in return for predictable,
well-formed data. Any questions about those data spawns further,
uncomfortable questions about the value of our investment.
We expect TypeScript to tell us when things break.``
