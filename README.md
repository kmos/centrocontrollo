# Centro Di controllo Sensori 

#Application Tree
```
    - app
        ----- models/
        ---------- user.js <!-- the nerd model to handle -->
    ----- routes.js
    - config
        ----- db.js 
    - node_modules <!-- created by npm install -->
    - public <!-- all frontend and angular stuff -->
    ----- css
    ----- js
    ---------- controllers <!-- angular controllers -->
    ---------- services <!-- angular services -->
    ---------- app.js <!-- angular application -->
    ---------- appRoutes.js <!-- angular routes -->
    ----- img
    ----- libs <!-- created by bower install -->
    ----- views 
    ---------- home.html
    ----- index.html
    - .bowerrc <!-- tells bower where to put files (public/libs) -->
    - bower.json <!-- tells bower which files we need -->
    - package.json <!-- tells npm which packages we need -->
    - server.js <!-- set up our node application -->
```

#Installation
Comands to install application dependencies:

```
npm install
```

```
bower install
```
#TODO
- interfaccia login
- Monitor/memodatabase
- comunicazione sched
- gestione CRUD nodi
- gestione crud sensore

