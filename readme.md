# Startanull - набор задач для сборки проекта через Gulp

## Установка

Для сборки проекта необходимо установить Node.JS, глобальный пакет Gulp

```
[sudo] npm install -g gulp
```

Установить локальные зависимости проекта

```
[sudo] npm install
```

## Настройка

Все настройки сборщика находятся в файле `.startanull.conf.js`

## Стандартная сборка

### Стили

Компиляция препроцессором

```
gulp styles.build
```

Постобработка скомпилированных стилей: расставление вендорных префиксов, причесывание (csscomb), сжатие.

```
gulp styles.dist
```

Полная сборка стилей

```
gulp styles.batch
```

### Скрипты Javascript

Сборка скриптов через Webpack

```
gulp scripts.build
```

Копирование библиотек в результирующию папку

```
gulp scripts.copylibs
```

### Шаблоны Jade

```
gulp templates.build
```

### Полная сборка

```
gulp
```

## Сборка компонентов

По-умолчанию данные команды работают со всеми компонентами. Чтобы собрать определенный компонент, необходимо указать
ключ `--component`, например

```
gulp [component.task] --component=dummy
```

### Стили

Компиляция препроцессором

```
gulp component.styles.build
```

Постобработка скомпилированных стилей: расставление вендорных префиксов, причесывание (csscomb), сжатие.

```
gulp component.styles.dist
```

Полная сборка стилей

```
gulp component.styles.batch
```

### Скрипты Javascript

Сборка скриптов через Webpack

```
gulp component.scripts.build
```

### Полная сборка

```
gulp component.build
```
