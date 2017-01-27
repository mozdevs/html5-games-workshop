'use strict';

const path = require('path');

const metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const assets = require('metalsmith-assets');
const layouts = require('metalsmith-layouts');
const multiLanguage = require('metalsmith-multi-language');
const permalinks = require('metalsmith-permalinks');
const collections = require('metalsmith-collections');
const rewrite = require('metalsmith-rewrite');
const slug = require('metalsmith-slug');

const DEFAULT_LOCALE = 'en';
const LOCALES = ['en', 'es'];

metalsmith(__dirname)
    .source('src/content')
    .use(collections({
        'platformer_en': {
            pattern: 'platformer/*_en.md',
            sortBy: 'title'
        },
        'platformer_es': {
            pattern: 'platformer/*_es.md',
            sortBy: 'title'
        }
    }))
    .use(multiLanguage({
        locales: LOCALES,
        default: DEFAULT_LOCALE
    }))
    .use(slug())
    .use(markdown())
    .use(permalinks({
        relative: false,
        pattern: ':locale/:title/',
        linksets: [{
            match: { collection: 'platformer_en' },
            pattern: ':locale/guides/platformer/:slug'
        }, {
            match: { collection: 'platformer_es' },
            pattern: ':locale/guias/plataformas/:slug'
        }]
    }))
    .use(layouts({
        engine: 'pug',
        default: 'default.pug',
        pattern: '**/*.html',
        directory: 'src/layouts'
    }))
    .use(assets({source: 'src/assets'}))
    .destination('dist')
    .build(function (err) {
        if (err) { console.error(err); }
    });
