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
const relative = require('metalsmith-relative');
const prefixoid = require('metalsmith-prefixoid');

const argv = require('minimist')(process.argv.slice(2));

const DEFAULT_LOCALE = 'en';
const LOCALES = ['en', 'es'];

metalsmith(__dirname)
    .source('src/content')
    .use(collections({
        'platformer_en': {
            pattern: 'platformer/*_en.md',
            sortBy: 'path'
        },
        'platformer_es': {
            pattern: 'platformer/*_es.md',
            sortBy: 'path'
        },
        'setup_en': {
            pattern: 'setup/*_en.md',
            sortBy: 'path'
        },
        'bonus': {
            pattern: 'bonus/*.md'
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
        pattern: ':locale/:slug/',
        linksets: [{
            match: { collection: 'platformer_en' },
            pattern: ':locale/guides/platformer/:slug'
        }, {
            match: { collection: 'platformer_es' },
            pattern: ':locale/guias/plataformas/:slug'
        }, {
            match: { collection: 'setup_en' },
            pattern: ':locale/guides/setup/:slug'
        }, {
            match: { collection: 'bonus' },
            pattern: ':locale/bonus/:slug'
        }]
    }))
    .use(relative())
    .use(layouts({
        engine: 'pug',
        default: 'default.pug',
        pattern: '**/*.html',
        directory: 'src/layouts',
        cache: false,
        pretty: true
    }))
    .use(assets({source: 'src/assets'}))
    .use(prefixoid({
        prefix: argv.base || '',
        tag: 'a',
        attr: 'href'
    }))
    .use(prefixoid({
        prefix: argv.base || '',
        tag: 'img',
        attr: 'src'
    }))
    .destination('dist')
    .build(function (err) {
        if (err) { console.error(err); }
    });
