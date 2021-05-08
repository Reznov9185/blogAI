require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const Blog = require('./models/blog');
const BlogReport = require('./models/blog_report');
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
    
      const sentences = content.replace(/&lt;/g,'<')
      .replace(/&gt;/g,'>')
      .replace(/&amp;/g,'&')
      .replace( /(<([^>]+)>)/ig, '')
      .replace(/^\s+|\s+$/g, '')
      .split(".");
      
      console.log(sentences); 
      model.classify(sentences).then(predictions => {
        // `predictions` is an array of objects, one for each prediction head,
        // that contains the raw probabilities for each input along with the
        // final prediction in `match` (either `true` or `false`).
        // If neither prediction exceeds the threshold, `match` is `null`.
        predictStr = JSON.stringify(predictions, null, 2);
        // console.log(predictStr);

        sentences.forEach(storeReport);

        function storeReport(item, index) {
          let jsonData = {};
          jsonData["identity_attack"] = predictions[0].results[index];
          jsonData["insult"] = predictions[1].results[index];
          jsonData["obscene"] = predictions[2].results[index];
          jsonData["severe_toxicity"] = predictions[3].results[index];
          jsonData["sexual_explicit"] = predictions[4].results[index];
          jsonData["threat"] = predictions[5].results[index];
          jsonData["toxicity"] = predictions[6].results[index];
          let newBlogReport = new BlogReport(
            {
              blog: checkblog._id,
              sentence: item,
              classification: jsonData
            }
          );
          newBlogReport.save().then(function(){
            console.log(newBlogReport);
          }).catch(function(error){
            console.log("Error" + error);
          });
        }
      });
    
    });
    
  }catch(err){
    console.log(err)
  }
};

// checkToxicity("6094fe028944b74324111a44");

