const express = require('express');
const router = express.Router();
const caliController = require('../controllers/caliController');

/**
 * App Routes
 */
router.get('/', caliController.homepage);
router.get('/thoughts/:id', caliController.exploreThoughts );
router.get('/categories', caliController.exploreCategories);
router.get('/explore-latest', caliController.exploreLatest);
router.get('/explore-random', caliController.exploreRandom);
router.get('/submit-thoughts', caliController.submitThoughts);
router.post('/submit-thoughts', caliController.submitThoughtsOnPost);
router.get('/edit-thoughts/:id', caliController.updateThoughts);
router.post('/edit-thoughts/:id', caliController.updateThoughtsOnPost);
router.get('/delete-thoughts/:name', caliController.deleteThoughts);

module.exports = router;
