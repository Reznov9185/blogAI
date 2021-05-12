## BlogAI
#### *A simple blogging platform with intent detection capability* 

##### To run
- `npm` and `node` installed   
- Run `npm install` to install the dependencies
- Run `node app.js` to run the node server on port `3000`
- Browse: `http://localhost:3000/`

##### To develop
1. Keep running `sass --watch scss/index.scss:public/css/style.css` and edit your css in `scss/index.scss` for now.
2. Make sure you have mongodb installed and running. Check `app.js` for the connection string for the `mongo` database.
3. Use `nodemon app.js` is place of `node app.js` (doesn't require to restart node each time).


##### Todo list:
1. Integrate `MongoDB` with `mongoose`
2. Create `Blog` model
3. Enable `CRUD` operation with routes and views for Blogs Model
4. Integrate `ckeditor4` for writing and editing blogs
5. `Add features` to the blogging platform
6. `Authentication` for blogging (If time permits)
7. Train and recognize intent with `tensorflowjs`

##### References & Sources:
1. [nodejs](https://nodejs.org/en/)
2. [expressjs](http://expressjs.com/)
3. [bootstrap](https://getbootstrap.com/)
4. [node-sass](https://www.npmjs.com/package/node-sass)
5. [ejs](https://www.npmjs.com/package/ejs)
6. [mongoose](https://mongoosejs.com/)
7. [tensorflowjs](https://www.npmjs.com/package/@tensorflow/tfjs)
8. [tensorflow-models/toxicity](https://www.npmjs.com/package/@tensorflow-models/toxicity)
