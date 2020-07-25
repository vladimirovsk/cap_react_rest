    const
        config = require('../config'),
        libs = require('../libs/function'),
        models = require('../models/auth'),
        works = require('../models/work'),
        { Pool, types } = require('pg'),
        jwt = require('jsonwebtoken'),
        bodyParser = require('body-parser'),
        express = require('express'),
        router = express.Router(),
        bcrypt = require('bcrypt');

    global.pool_auth = new Pool(config.pool_terminal);
    global.pool_pay = new Pool(config.pool_payments);

    router.use(bodyParser.urlencoded({extended: true}));
    router.use(bodyParser.json());

    router.all('/', require('./index'));

    router.post('/login', async (req, res) => {
    try{ 
        let h = await libs.execQuery(models.SelectByEmail, [req.body.email], global.pool_auth);
        //console.log(h)
        if (Boolean(h.rows[0])){
            let token = await jwt.sign({id:h.rows[0].id}, config.jwt_params.jwt_secret, {expiresIn:86400});
            const hash = await h.rows[0].password;
            let salt = bcrypt.genSaltSync(256);
            //console.log(bcrypt.hashSync(req.body.password, salt));
            if (bcrypt.compareSync(req.body.password, hash, salt)){
                console.log('login by email:', req.body.email);
                res.status(200).send({auth: true, jwt: token , userId: h.rows[0].id, email: h.rows[0].email, firstname: h.rows[0].firstname, lastname: h.rows[0].lastname});
            }else
            {
                res.status(401).send({auth: false, email:req.body.email});
                console.log('error login by email:', req.body.email);

            }

        }else{
            res.status(401).send({auth: false, error: "not find user "+req.body.email});
            console.log('not find user:', req.body.email);
        }
        return;
    }
    catch(err) {
        res.status(500).send({ auth: false, error: err });
        console.log('auth: false', err);
        return;
    }
});
    router.post("/getUidFromUser", async(req, res) => {
        try{ 
        let h = await libs.execQuery(models.GetUidFromUser, [req.body.user_id], global.pool_auth);
            if (Boolean(h.rows[0])){
                res.status(200).send({auth: true, data: h.rows});
            }else{
                res.status(401).send({auth: false, error: "not find user "+req.body.email});
                console.log('not find user:', req.body.user_id);
            }
        }
        catch (err) {
            res.status(500).send({ auth: false, error: err });
            console.log('uid: 0', err);
            return;
        }   
    })

    router.post("/getPayMount", async (req, res) => {
        //try{
            //console.log(req.body);
            let datan = req.body.year_yyyy+'-01-01 00:00:00';
            let datak = req.body.year_yyyy+'-12-31 23:59:59';
            //console.log('START - getPayMount from data: '+datan + ' to '+datak);

            let h = await libs.execQuery(works.SelectPayMount, [req.body.client_id, datan, datak], global.pool_pay);
            res.status(200).send({ auth: true, dataset: h.rows });
            console.log('Query - getPayMount from data: '+datan + ' to '+datak);

        //}
        //catch (err) {
        //    res.status(500).send({ auth: false, error: err });
        //    return;
        //}
    });

    router.post("/getDirectories", async (req, res) => {
        try{

        }
        catch (err) {
            res.status(500).send({ auth: false, error: err });
            return;
        }
    });

//router.post('/register-admin', function(req, res) {
/*db.insertAdmin([
    req.body.name,
    req.body.email,
    bcrypt.hashSync(req.body.password, 8),
    1
],
function (err) {
    if (err) return res.status(500).send("There was a problem registering the user.")
    .selectByEmail(req.body.email, (err,user) => {
        if (err) return res.status(500).send("There was a problem getting user")
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, user: user });
    });
}); */
//});

router.post('/register', function(req, res) {
    /*db.insert([
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8)
    ],
    function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        db.selectByEmail(req.body.email, (err,user) => {
            if (err) return res.status(500).send("There was a problem getting user")
            let token = jwt.sign({ id: user.id }, config.secret, {expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token, user: user });
        });
    });*/
});

//heat.php?SN=61899057&Energy1=5283.00&POWER=0.00&TEMP1=23.00&TEMP2=22.58&FLOW=0.00
//router.get('/heat.php', async (req,res) => {
//console.log(req.query);
//    res.status(200).send(req.query)
//});
/*router.post('/login', (req, res) => {

    db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, user: user });
    });

})*/
module.exports = router;
