# GDELT-Graphql-Analysis ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

In this project we're analysing GDELT data with GraphQL. GDELT is a free, constantly-updating data source that publishes world-event related data.

The project was done by:
1. Riccardo [https://github.com/riccardotommasini]
2. Maxim [https://github.com/MaximSantalov]
3. Karl-Gustav [https://github.com/KGKallasmaa]

The project is part of the Big Data Management course at university of Tartu.

## Running the project locally, from scratch

```bash
bash start.sh
```

## Running the development server

```javascript
nodemon src/server.jsx
```

## Running the production server

```javascript
node src/server.jsx
```

## Executing queries

Navigate to localhost:3000. There you can find the GraphQl GUI. It's advisable that you study src/graphql/schema.jsx before hand. 

An example of queries can be found  [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/12cuhve2mQtwXIFwR9Xq0Y6bZwNo9TGaa?usp=sharing)


### Contributing

We're happy if you want to contribute to this project. Github <a href="https://github.com/github/super-linter/">Super-linter</a> analyses the code before hand.