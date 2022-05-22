require('../models/database');
const Category = require('../models/Category');
const Thoughts = require('../models/Thoughts');


/**
 * GET /
 * Homepage
 */
exports.homepage = async(req, res) => {

   try {

      const limitNumber = 10;
      const categories = await Category.find({}).limit(limitNumber);
      const latest = await Thoughts.find({}).sort({_id: -1}).limit(limitNumber);
      const kitten = await Thoughts.find({ 'category': 'Kitten' }).limit(limitNumber);
      const diva = await Thoughts.find({ 'category': 'Diva' }).limit(limitNumber);
      const lazy = await Thoughts.find({ 'category': 'Lazy' }).limit(limitNumber);
      const thinking = await Thoughts.find({ 'category': 'Thinking' }).limit(limitNumber);

      const play = {latest, kitten, diva, lazy, thinking };

      res.render('index', { title: 'Calis Blog - Home', categories, play});
   }  catch (error) {
      res.status(500).send({message: error.message || "Error Occured"})
   }
}




/**
 * GET / categories
 * Categories
 */
 exports.exploreCategories = async(req, res) => {

   try {

      const limitNumber = 20;
      const categories = await Category.find({}).limit(limitNumber);
      res.render('categories', { title: 'Calis Blog - Categories', categories} );
   }  catch (error) {
      res.status(500).send({message: error.message || "Error Occured"})
   }
}

/**
 * GET /thoughts/:id
 * Thoughts 
*/
exports.exploreThoughts = async(req, res) => {
   try {
     let thoughtsId = req.params.id;
     const thoughts = await Thoughts.findById(thoughtsId);
     res.render('thoughts', { title: 'Calis Blog - Thoughts', thoughts } );
   } catch (error) {
     res.satus(500).send({message: error.message || "Error Occured" });
   }
 } 

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
   try {
     const limitNumber = 20;
     const thoughts = await Thoughts.find({}).sort({ _id: -1 }).limit(limitNumber);
     res.render('explore-latest', { title: 'Calis Blog - Explore Latest', thoughts } );
   } catch (error) {
     res.satus(500).send({message: error.message || "Error Occured" });
   }
 } 
 
 
 
 /**
  * GET /explore-random
  * Explore Random as JSON
 */
 exports.exploreRandom = async(req, res) => {
   try {
     let count = await Thoughts.find().countDocuments();
     let random = Math.floor(Math.random() * count);
     let thoughts = await Thoughts.findOne().skip(random).exec();
     res.render('explore-random', { title: 'Cooking Blog - Explore Latest', thoughts } );
   } catch (error) {
     res.satus(500).send({message: error.message || "Error Occured" });
   }
 } 

/**
 * GET /submit-thoughts
 * Submit Thoughts
*/
exports.submitThoughts = async(req, res) => {
   const infoErrorsObj = req.flash('infoErrors');
   const infoSubmitObj = req.flash('infoSubmit');
   res.render('submit-thoughts', { title: 'Cooking Blog - Submit Thoughts', infoErrorsObj, infoSubmitObj  } );
 }
 
 /**
  * POST /submit-thoughts
  * Submit Thoughts
 */
 exports.submitThoughtsOnPost = async(req, res) => {
   try { 
     const newThoughts = new Thoughts({
       name: req.body.name,
       description: req.body.description,
     });
     
     await newThoughts.save();
 
     req.flash('infoSubmit', 'Thoughts has been added.')
     res.redirect('/submit-thoughts');
   } catch (error) {
     // res.json(error);
     req.flash('infoErrors', error);
     res.redirect('/submit-thoughts');
   }
 }

//  Delete Thoughts
exports.deleteThoughts = async(req, res) => {
   try {
    let thoughtsName = req.params.name;
    await Thoughts.deleteOne({ name: thoughtsName });
    res.redirect('/');
   } catch (error) {
      console.log(error);
   }
}


exports.updateThoughts = async(req, res) => {
  let thoughtsId = req.params.id;
  const thoughts = await Thoughts.findById(thoughtsId);
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('edit-thoughts', { title: 'Calis Blog - Submit Thoughts', thoughts, infoErrorsObj, infoSubmitObj  } );
}

// Update Thoughts
exports.updateThoughtsOnPost = async(req, res) => {
  try {
    const thoughts = await Thoughts.findById(req.params.id);
    let oldName = thoughts.name
    let newName = req.body.newname
    let oldDescription = thoughts.description
    let newDescription = req.body.newdescription
    const resname = await Thoughts.updateOne({ name: oldName }, { name: newName });
    resname.n; // Number of documents matched
    resname.nModified; // Number of documents modified
    const resdesc = await Thoughts.updateOne({ description: oldDescription }, { description: newDescription });
    resdesc.n; // Number of documents matched
    resdesc.nModified; // Number of documents modified
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
}
// updateThoughts();

//  async function insertDymmyThougthsData(){

//     try{
//        await Thoughts.insertMany([
//          {
//           "name": "New adtion to the family",
//           "description": `It is advisable to bring the kitten home with some bedding; this will act as a familiar object when everything else is new.
//            The initial twenty-four hours should be a calm period of adjustment so it’s probably best for any children in the household to understand that the kitten should be left alone for a while. 
//           The kitten room should be prepared in advance to enable the new arrival to settle in comfortably with minimum disturbance. 
//           Place the cat basket on the floor gently and open the lid; allow the kitten to explore in its own time. It may be experiencing many of the room’s sights, sounds, smells and textures for the first time so be patient and allow a period of investigation.`,
//           "email": "kittenemail@gmail.com",
//           "category": "Kitten", 
//          "image":"sick.jpeg"
         
//         },
//         { 
//           "name": "Feeling Diva",
//          "description": `Cats use tail positions to tell us how they are feeling. “It’s their way of letting us know when they are happy and playful, feeling threatened, scared, or even not feeling well,” says Dr. Zacharias.
//           “Happy, confident cats hold their tail in a question mark position. These cats are in a good mood and usually ready to interact.” Their body language can reveal a lot, but it can’t reveal everything. Here’s what your cat would love to tell you if he could.`,
//           "email": "diva@gmail.com",
//          "category": "Diva", 
//          "image":"sick.jpeg"
//          },
//          { 
//           "name": "Happy Catt, Happy human",
//        "description": `In addition to chirping, cats that greet you with quick and high meows can also be a sign that they’re in good spirits. “When the owner is gone for the day and is greeted by meows at the door, this vocalization is a greeting.
//            It may also be an expression that the cat is happy to see the owner,” says Dr. Sung. “Sometimes cats come up and meow to solicit attention. In this situation, the cat may want the owner to interact with him in some manner, whether it’s to pet the cat, give him or her food, or perhaps play with the cat.”`,
//          "email": "happycat@gmail.com",
//         "category": "My human", 
//          "image":"sick.jpeg"
//           },
//          { 
//          "name": "Purrsssss ",
//          "description": `“Cat purrs during interactions with people, greeting familiar cats, while nursing kittens, or being pet can mean they’re feeling happy and content,” says Dr. Sung. 
//           “Cats may also purr when they are sleepy or drowsy or when they are in warm, familiar environments when soliciting food from the owner, and kneading.” 
//          You can generally interpret purring as positive if your kitty also exhibits some of the other telltale signs of contentment on this list. That said, a purring cat is not always a happy cat.`,
//          "email": "purrss@gmail.com",
//          "category": "Lazy",
//          "image":"sick.jpeg" 
//         },
//         { 
//          "name": "What do cats think about us ",
//       "description": `Experts tell us that cats treat humans like bigger versions of themselves. While your cat doesn't think you're his mother, he probably shows you the same level of affection and respect he gave his mother when he was young.
//           It's believed that cats think humans are very much like them`,
//          "email": "think@gmail.com",
//          "category": "Thinking", 
//         "image":"sick.jpeg"
//          },

//        ]);
//    }  catch (error) {
//       console.log('err', + error)
//    }
//  }
//  insertDymmyThougthsData();


// //  "name": "Kiten",
// //  "image": "baby.jpeg"
// // },
// // {
// //  "name": "Diva",
// //  "image": "diva.jpeg"
// // },
// // {
// //  "name": "Human",
// //  "image": "human.jpeg"
// // },
// // {
// //  "name": "Lazy",
// //  "image": "lazy.jpeg"
// // },
// // {
// //  "name": "Thinking",
// //  "image": "thinking.jpeg"
// // },
// // {
// //  "name": "All",
// //  "image": "all.jpeg"
// // }

// // ]);