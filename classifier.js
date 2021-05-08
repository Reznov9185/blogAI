require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const Blog = require('./models/blog')
const mongoose = require('mongoose');
// export {checkToxicity};


mongoose.connect('mongodb://localhost:27017/blog_database', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .catch(error => console.log("Something went wrong: " + error));


// The minimum prediction confidence.
const threshold = 0.8;

exports.checkToxicity = async function  (blogId){
  var predictStr = ""
  try{
    const checkblog = await Blog.findById(blogId)

  
    toxicity.load(threshold).then(model => {

    content = JSON.stringify(checkblog.content)
  
    const sentences = content.split(".");
    
  
    model.classify(sentences).then(predictions => {
      // `predictions` is an array of objects, one for each prediction head,
      // that contains the raw probabilities for each input along with the
      // final prediction in `match` (either `true` or `false`).
      // If neither prediction exceeds the threshold, `match` is `null`.
      predictStr = JSON.stringify(predictions, null, 2);
      console.log(predictStr);

    });
    
  });
    
  }catch(err){
  console.log(err)
  }  
  
  
};

// checkToxicity("6094fe028944b74324111a44");

