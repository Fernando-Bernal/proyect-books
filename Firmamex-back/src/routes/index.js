import {Router} from 'express';
import axios from 'axios';

const router = Router();


router.get('/', (req, res) => {
    res.send('Hello World !');
});
router.get('/books', (req, res) => {
    let name = req.body.nombre;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${name}&key=${process.env.APIKEY_BOOKS}`;

    axios.get(url)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: 'An error occurred' });
        });
});

export default router;